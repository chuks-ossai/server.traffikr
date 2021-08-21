const Category = require("../models/category");
const slugify = require("slugify");

exports.getAllCategories = (req, res) => {};

exports.getCategoryBySlug = (req, res) => {};

exports.createCategory = (req, res) => {
  const { name, img, description } = req.body;

  const slug = slugify(name);
  const shadowImg = img || {
    url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
    key: `${Math.floor(Math.random())}`,
  };

  const newCategory = new Category({
    name,
    img: shadowImg,
    slug,
    description,
  });

  console.log("requested by", req.user.data);
  newCategory.postedBy = req.profile._id;

  newCategory.save((err, data) => {
    if (err) {
      console.log("CATE CREATE ERR", err);
      return res.status(200).json({
        ErrorMessage: "Unable to create record. Please try again.",
        Success: false,
        Results: null,
      });
    }

    return res.status(200).json({
      ErrorMessage: null,
      Success: true,
      Results: [{ message: "Record created successfully", data }],
    });
  });
};

exports.updateCategory = (req, res) => {};

exports.deleteCategory = (req, res) => {};
