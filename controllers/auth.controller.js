const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { registerEmailTemplate } = require("../helpers/email-template");
const User = require("../models/user");
const {
  resetPasswordEmailTemplate,
} = require("../helpers/reset-password-email-template");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2021-08-12" });

exports.registerController = (req, res) => {
  User.findOne({ emailAddress: req.body.emailAddress }).exec((err, user) => {
    if (user) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "User with the email already exist",
        Results: [],
      });
    }

    const token = jwt.sign(
      {
        data: {
          fullName: req.body.fullName,
          emailAddress: req.body.emailAddress,
          password: req.body.password,
          username: req.body.username,
        },
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "3d" }
    );

    const params = registerEmailTemplate(
      req.body.fullName,
      req.body.emailAddress,
      token
    );

    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
      .then((data) => {
        res.json({
          Success: true,
          ErrorMessage: null,
          Results: [
            {
              message: `Email has been sent to ${req.body.emailAddress}, Follow the instructions to complete your registration`,
            },
          ],
        });
      })
      .catch((err) => {
        res.json({
          Success: false,
          ErrorMessage: "Unable to verify the email used. Please try again",
          Results: null,
        });
      });
  });
};

exports.activateAccountController = (req, res) => {
  const { token } = req.body;

  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(200).json({
          Success: false,
          ErrorMessage:
            "The activation link has expired. Please try and register again",
          Results: null,
        });
      }

      const { data } = decoded;

      const newUser = new User({ ...data });
      newUser.save((err, savedUser) => {
        if (err) {
          return res.status(200).json({
            Results: null,
            Success: false,
            ErrorMessage: "Error creating user in database. Try again later",
          });
        }

        return res.status(200).json({
          Results: [
            { message: "Account activated successfully. You can now login" },
          ],
          Success: true,
          ErrorMessage: null,
        });
      });
    }
  );
};

exports.loginController = (req, res) => {
  User.findOne({ emailAddress: req.body.emailAddress }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "Invalid Email or password",
        Results: [],
      });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "Invalid Email or password",
        Results: [],
      });
    }

    const token = jwt.sign(
      {
        data: {
          emailAddress: user.emailAddress,
          _id: user._id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.password_hash = undefined;
    user.salt = undefined;
    res.status(200).json({
      Success: true,
      ErrorMessage: null,
      Results: [{ message: "Login successful", user, token }],
    });
  });
};

exports.forgotPasswordController = (req, res) => {
  const { emailAddress } = req.body;

  User.findOne({ emailAddress }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "Unrecognized email provided",
        Results: null,
      });
    }

    const token = jwt.sign(
      {
        data: {
          id: user._id,
          fullName: user.fullName,
        },
      },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "15m" }
    );

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(200).json({
          Success: false,
          ErrorMessage:
            "Unable to generate link at this time. Please try later",
          Results: null,
        });
      }

      const params = resetPasswordEmailTemplate(
        user.fullName,
        user.emailAddress,
        token
      );

      const sendEmail = ses.sendEmail(params).promise();

      sendEmail
        .then((data) => {
          res.json({
            Success: true,
            ErrorMessage: null,
            Results: [
              {
                message: `Email has been sent to ${emailAddress}.`,
              },
            ],
          });
        })
        .catch((err) => {
          res.json({
            Success: false,
            ErrorMessage:
              "Unable to send link to the provided email. Please try again later",
            Results: null,
          });
        });
    });
  });
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, password } = req.body;

  jwt.verify(
    resetPasswordLink,
    process.env.JWT_RESET_PASSWORD,
    function (err, decoded) {
      if (err) {
        return res.status(200).json({
          Success: false,
          ErrorMessage:
            "The reset link has expired. Please try and register again",
          Results: null,
        });
      }

      User.findOne({ resetPasswordLink }).exec((err, user) => {
        if (err || !user) {
          res.status(200).json({
            Success: false,
            ErrorMessage:
              "Unable to send link to the provided email. Please try again later",
            Results: null,
          });
        }

        user.resetPasswordLink = "";
        user.password = password;
        user.save((err) => {
          if (err) {
            return res.status(200).json({
              Success: false,
              ErrorMessage: "Unable to reset password. Please try again later",
              Results: null,
            });
          }

          res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [
              {
                message:
                  "Password reset successfully. Login with your new password",
              },
            ],
          });
        });
      });
    }
  );
};

exports.validateToken = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "User not found",
        Results: null,
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const authUserId = req.user.data._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(200).json({
        Success: false,
        ErrorMessage: "User not found",
        Results: null,
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        Success: false,
        ErrorMessage: "You are not authorized to access admin resource.",
        Results: null,
      });
    }

    user.password_hash = undefined;
    user.salt = undefined;
    req.profile = user;
    next();
  });
};
