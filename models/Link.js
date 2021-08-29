const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    postedBy: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    categories: [
      {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    type: {
      type: String,
      default: "free",
    },
    medium: {
      type: String,
      default: "article",
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
