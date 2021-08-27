const Link = require("../models/link");
const slugify = require("slugify");
const uuid = require("uuid");
const AWS = require("aws-sdk");
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
    postedBy: req.profile._id,
  });

  newLink.save((err, success) => {
    if (err) {
      return next(
        errorResponse("Something went wrong while try to save record.")
      );
    }

    return res
      .status(200)
      .json(successResponse("Record created successfully", success));
  });
};

exports.updateLink = (req, res, next) => {};

exports.deleteLink = (req, res, next) => {};
