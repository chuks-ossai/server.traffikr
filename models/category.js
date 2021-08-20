const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    img: {
      url: String,
      key: String,
    },

    content: {
      type: {},
      min: 28,
      max: 2000000,
    },
    postedBy: {
      type: mongoose.isValidObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
