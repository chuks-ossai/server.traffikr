const AWS = require("aws-sdk");
const Link = require("../models/link");
const Category = require("../models/category");
const User = require("../models/user");
const { errorResponse, successResponse } = require("../helpers/baseResponse");
const { linkPublishedParams } = require("../helpers/email-template");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2021-08-12" });

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

    res
      .status(200)
      .json(successResponse("Record created successfully", success));

    User.find({ interestedTopics: { $in: categories } }).exec((err, users) => {
      if (err) {
        console.log("Error finding users to send email to", err);
      }

      Category.find({ _id: { $in: categories } }).exec((err, cats) => {
        success.categories = cats;

        users.forEach((user) => {
          const param = linkPublishedParams(
            user.emailAddress,
            user.fullName,
            success
          );
          ses
            .sendEmail(param)
            .promise()
            .then((sent) => {
              console.log("email sent successfully", sent);
              return;
            })
            .catch((failed) => {
              console.log("unable to send email", failed);
              return;
            });
        });
      });
    });
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

  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) {
      return next(
        errorResponse("Something went wrong while trying to delete record")
      );
    }

    return res
      .status(200)
      .json(successResponse("Record created successfully", data));
  });
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

exports.getTrending = (req, res, next) => {
  Link.find()
    .populate("categories", "slug name")
    .populate("postedBy", "name")
    .limit(3)
    .sort({ clicks: -1 })
    .exec((err, links) => {
      if (err) {
        return next(
          errorResponse("Something went wrong while trying get links")
        );
      }

      return res.status(200).json(successResponse(null, links));
    });
};

exports.getTrendingByCategory = (req, res, next) => {
  const { categorySlug } = req.params;

  Category.findOne({ slug: categorySlug }).exec((err, category) => {
    if (err) {
      return next(
        errorResponse("Something went wrong while trying get category")
      );
    }

    Link.find({ categories: category })
      .populate("categories", "slug name")
      .populate("postedBy", "name")
      .limit(5)
      .sort({ clicks: -1 })
      .exec((err, links) => {
        if (err) {
          return next(
            errorResponse("Something went wrong while trying get links")
          );
        }

        return res.status(200).json(successResponse(null, links));
      });
  });
};
