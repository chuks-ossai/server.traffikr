const { errorResponse, successResponse } = require("../helpers/baseResponse");
const Link = require("../models/Link");
const User = require("../models/User");

exports.profileController = (req, res, next) => {
  Link.find({ postedBy: req.profile })
    .populate("categories", "name slug")
    .populate("postedBy", "name")
    .sort({ createdAt: -1 })
    .exec((err, links) => {
      if (err && !links) {
        return next(
          errorResponse("Something went wrong while trying to get your links.")
        );
      }

      req.profile.password_hash = undefined;
      req.profile.salt = undefined;

      // return successResponse("", { profile: req.profile, links });
      return res.status(200).json({
        Success: true,
        ErrorMessage: null,
        Results: [{ profile: req.profile, links }],
      });
    });
};

exports.updateProfileController = (req, res, next) => {
  const { fullName, interestedTopics, password, userName, otherTopics } =
    req.body;

  if (password) {
    if (password.length < 6) {
      return next(
        errorResponse("Password cannot be less than six characters long.")
      );
    }

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { fullName, password, interestedTopics, userName, otherTopics },
      { new: true, useFindAndModify: false }
    ).exec((err, updatedProfile) => {
      if (err) {
        return next(
          errorResponse("Something went wrong, unable to update profile.")
        );
      }

      updatedProfile.hashed_password = undefined;
      updatedProfile.salt = undefined;

      return res
        .status(200)
        .json(successResponse("Profile updated successfully", updatedProfile));
    });
  } else {
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { fullName, interestedTopics, userName, otherTopics },
      { new: true, useFindAndModify: false }
    ).exec((err, updatedProfile) => {
      if (err) {
        return next(
          errorResponse("Something went wrong, unable to update profile.")
        );
      }

      updatedProfile.password_hash = undefined;
      updatedProfile.salt = undefined;

      return res
        .status(200)
        .json(successResponse("Profile updated successfully", updatedProfile));
    });
  }
};
