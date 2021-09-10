const { errorResponse, successResponse } = require("../helpers/baseResponse");
const Link = require("../models/link");

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
