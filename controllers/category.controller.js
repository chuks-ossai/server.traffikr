const Category = require("../models/category");
const slugify = require("slugify");
const uuid = require("uuid");
const AWS = require("aws-sdk");
const { errorResponse, successResponse } = require("../helpers/baseResponse");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGEION,
});

exports.getAllCategories = (req, res, next) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return next(errorResponse("Unable to load data."));
    }

    res.status(200).json(successResponse(undefined, data));
  });
};

exports.getCategoryBySlug = (req, res) => {};

exports.createCategory = (req, res, next) => {
  const { name, description, img } = req.body;

  const bs64 = new Buffer.from(
    img.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const imgType = img.split(";")[0].split("/")[1];

  const slug = slugify(name);
  const newCategory = new Category({
    name,
    slug,
    description,
    postedBy: req.profile._id,
  });

  const params = {
    Bucket: "traffikr-assets",
    Key: `category/${uuid.v4()}.${imgType}`,
    Body: bs64,
    ACL: "public-read",
    ContentType: `image/${imgType}`,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      return next(errorResponse("Something went wrong while uploading image."));
    }

    newCategory.img = {
      url: data.Location,
      key: data.Key,
    };

    newCategory.save((err, success) => {
      if (err) {
        return next(
          errorResponse("Something went wrong while try to save record.")
        );
      }

      return res
        .status(200)
        .json(successResponse("Record created successfully", success));
    });
  });
};

exports.updateCategory = (req, res) => {};

exports.deleteCategory = (req, res) => {};
