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

exports.getAdminLinks = (req, res, next) => {
  const { limit, skip } = req.query;
  let lmt = limit ? parseInt(limit) : 10;
  let skp = skip ? parseInt(skip) : 0;

  Link.find({})
    .populate("categories", "name slug")
    .populate("postedBy", "name")
    .sort({ createdAt: -1 })
    .limit(lmt)
    .skip(skp)
    .exec((err, links) => {
      if (err && !links) {
        return next(
          errorResponse("Something went wrong while trying to get your links.")
        );
      }
      // return successResponse("", { profile: req.profile, links });
      return res.status(200).json({
        Success: true,
        ErrorMessage: null,
        Results: links,
      });
    });
};

exports.getUserLinks = (req, res, next) => {
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
      // return successResponse("", { profile: req.profile, links });
      return res.status(200).json({
        Success: true,
        ErrorMessage: null,
        Results: links,
      });
    });
};

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

exports.updateLink = (req, res, next) => {
  const { id } = req.params;

  Link.findOneAndUpdate({ _id: id }, req.body, { new: true }).exec(
    (err, updatedLink) => {
      if (err) {
        return next(
          errorResponse("Something went wrong while trying to delete record")
        );
      }

      return res
        .status(200)
        .json(successResponse("Record updated successfully", updatedLink));
    }
  );
};

exports.deleteLink = (req, res, next) => {
  const { id } = req.params;

  if (req.profile.role === "admin") {
    Link.findOneAndRemove({ _id: id }).exec((err, data) => {
      if (err) {
        console.log(err);
        return next(
          errorResponse("Something went wrong while trying to delete record")
        );
      }

      return res
        .status(200)
        .json(successResponse("Record created successfully", data));
    });
  } else {
    Link.findById(id).exec((err, data) => {
      if (err || !data) {
        return next(
          errorResponse("Something went wrong. Unable to delete link")
        );
      }

      if (data.postedBy.equals(req.profile._id)) {
        Link.findOneAndRemove({ _id: data._id }).exec((err, deleted) => {
          if (err) {
            console.log(err);
            return next(
              errorResponse("Something went wrong. Unable to delete link")
            );
          }

          return res
            .status(200)
            .json(successResponse("Record created successfully", deleted));
        });
      } else {
        return next(
          errorResponse(
            "Sorry you cannot delete a link created by another user"
          )
        );
      }
    });
  }
};

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
