const Category = require("../models/category");
const slugify = require("slugify");
const formidable = require("formidable");
const fs = require("fs");
const uuid = require("uuid");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGEION,
});

exports.getAllCategories = (req, res) => {};

exports.getCategoryBySlug = (req, res) => {};

exports.createCategory = (req, res) => {
  const form = formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(200).json({
        ErrorMessage: "Unable to upload image. Please try again.",
        Success: false,
        Results: null,
      });
    }

    const { name, description } = fields;
    const { img } = files;
    const slug = slugify(name);
    const newCategory = new Category({
      name,
      slug,
      description,
      postedBy: req.profile._id,
    });

    if (img.size > 2000000) {
      return res.status(200).json({
        ErrorMessage: "Image size should not be more than 2MB",
        Success: false,
        Results: null,
      });
    }

    const params = {
      Bucket: "traffikr-assets",
      Key: `category/${uuid.v4()}`,
      Body: fs.readFileSync(img.path),
      ACL: "public-read",
      ContentType: "image/png",
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(200).json({
          ErrorMessage: "Something went wrong while uploading image.",
          Success: false,
          Results: null,
        });
      }

      newCategory.img = {
        url: data.Location,
        key: data.Key,
      };

      newCategory.save((err, success) => {
        if (err) {
          console.log(err);
          return res.status(200).json({
            ErrorMessage: "Something went wrong while try to save record.",
            Success: false,
            Results: null,
          });
        }

        return res.status(200).json({
          ErrorMessage: null,
          Success: true,
          Results: [
            { message: "Category created successfully.", data: success },
          ],
        });
      });
    });
  });
};

exports.updateCategory = (req, res) => {};

exports.deleteCategory = (req, res) => {};
