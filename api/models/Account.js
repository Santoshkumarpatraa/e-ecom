const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      default: '',
    },
    lastName: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      default: '',
    },
    password: {
      type: String,
      required: true,
      default: '',
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    contactNumber: {
      type: String,
      required: false,
      default: '',
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
    roleType: {
      type: String,
      required: true,
      default: '',
    },
    showTour: {
      type: Boolean,
      required: false,
      default: true,
    },
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: [String],
      recquired: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("account", schema);
