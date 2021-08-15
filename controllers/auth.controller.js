const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const { registerEmailTemplate } = require("../helpers/email-template");
const User = require("../models/user");

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
        ErrorMassage: "User with the email already exist",
        Results: [],
      });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: {
          fullName: req.body.fullName,
          emailAddress: req.body.emailAddress,
        },
      },
      process.env.JWT_ACCOUNT_ACTIVATION
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
