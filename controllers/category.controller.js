const Category = require("../models/category");
const Link = require("../models/link");
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
  Category.find({})
    .sort({ createdAt: -1 })
    .exec((err, data) => {
      if (err) {
        return next(errorResponse("Unable to load data."));
      }

      res.status(200).json(successResponse(undefined, data));
    });
};

exports.getCategoryBySlug = (req, res) => {
  const { slug } = req.params;
  const { limit, skip } = req.query;
  let lmt = limit ? parseInt(limit) : 10;
  let skp = skip ? parseInt(skip) : 0;

  Category.findOne({ slug })
    .populate("postedBy", "_id name username")
    .exec((err, category) => {
      if (err) {
        return next(errorResponse("Unable to load category."));
      }

      Link.find({ categories: category })
        .populate("postedBy", "_id name username")
        .populate("categories", "name")
        .sort({ createdAt: -1 })
        .limit(lmt)
        .skip(skp)
        .exec((err, links) => {
          if (err) {
            return next(
              errorResponse("Unable to load links of the category category.")
            );
          }
          res.status(200).json(successResponse(undefined, { category, links }));
        });
    });
};

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

exports.updateCategory = (req, res, next) => {
  const { slug } = req.params;
  const { name, img, description } = req.body;

  Category.findOneAndUpdate(
    { slug },
    { name, description },
    { new: true }
  ).exec((err, updatedCategory) => {
    if (err && !updatedCategory) {
      return next("Something when wrong while udateing category");
    }

    if (img) {
      const bs64 = new Buffer.from(
        img.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const imgType = img.split(";")[0].split("/")[1];

      const delParams = {
        Bucket: "traffikr-assets",
        Key: `${updatedCategory.img.key}`,
      };

      s3.deleteObject(delParams, function (err, deletedImg) {
        if (err) {
          return next("Unable to delete image during update");
        }

        const params = {
          Bucket: "traffikr-assets",
          Key: `category/${uuid.v4()}.${imgType}`,
          Body: bs64,
          ACL: "public-read",
          ContentType: `image/${imgType}`,
        };

        s3.upload(params, function (err, uploadedImg) {
          if (err) {
            return next(
              errorResponse("Something went wrong while uploading image.")
            );
          }

          updatedCategory.img = {
            url: uploadedImg.Location,
            key: uploadedImg.Key,
          };

          updatedCategory.save((err, savedCategory) => {
            if (err) {
              return next(
                errorResponse("Something went wrong while try to save record.")
              );
            }

            return res
              .status(200)
              .json(
                successResponse("Record updated successfully", savedCategory)
              );
          });
        });
      });
    } else {
      return res
        .status(200)
        .json(successResponse("Record updated successfully", updatedCategory));
    }
  });
};

exports.deleteCategory = (req, res) => {
  const { slug } = req.params;

  Category.findOneAndDelete({ slug }).exec((err, deletedCategory) => {
    if (err && !updatedCategory) {
      return next("Something when wrong while udateing category");
    }

    if (deletedCategory.img?.key) {
      const delParams = {
        Bucket: "traffikr-assets",
        Key: `${deletedCategory.img.key}`,
      };

      s3.deleteObject(delParams, function (err, deletedImg) {
        if (err) {
          return next(
            "Unable to delete image attached to this topic. Please contact the Admin"
          );
        }
        return res
          .status(200)
          .json(
            successResponse("Record deleted successfully", deletedCategory)
          );
      });
    }
  });
};
