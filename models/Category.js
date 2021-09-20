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
      type: {
        url: String,
        key: String,
      },
    },

    description: {
      type: {},
      min: 28,
      max: 2000000,
    },
    postedBy: {
      type: mongoose.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
