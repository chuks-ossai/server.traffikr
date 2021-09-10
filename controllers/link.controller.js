const Link = require("../models/link");
const { errorResponse, successResponse } = require("../helpers/baseResponse");

exports.getAllLinks = (req, res, next) => {
  Link.find({}).exec((err, data) => {
    if (err) {
      return next(errorResponse("Unable to load data."));
    }

    res.status(200).json(successResponse(undefined, data));
  });
};

exports.getLinkBySlug = (req, res, next) => {};
exports.getLinksByCategory = (req, res, next) => {};

exports.createLink = (req, res, next) => {
  const { title, url, medium, type, categories } = req.body;

  const newLink = new Link({
    title,
    url,
    medium,
    type,
    categories,
    slug: url,
    postedBy: req.profile._id,
  });

  newLink.save((err, success) => {
    if (err) {
      return next(
        errorResponse(`Something went wrong while try to save record. ${err}`)
      );
    }

    return res
      .status(200)
      .json(successResponse("Record created successfully", success));
  });
};

exports.updateLink = (req, res, next) => {};

exports.deleteLink = (req, res, next) => {};

exports.updateLinkClicks = (req, res, next) => {
  const { linkId } = req.params;

  Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { new: true }).exec(
    (err, result) => {
      if (err) {
        return next(
          errorResponse(
            `Something went wrong while try to update clicks. ${err}`
          )
        );
      }

      return res
        .status(200)
        .json(successResponse("Click Updated successfully", result));
    }
  );
};
