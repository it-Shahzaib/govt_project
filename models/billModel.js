const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
  },
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "activities",
  },
  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true,
      },
      bill_amount: {
        type: Number,
        required: true,
      },
    },
  ],
  bill_id: {
    type: String,
    unique: true,
    required: true,
  },
  payees_name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  payees_cnic: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  no_of_days: {
    type: Number,
    default: 0,
  },
  pst: {
    type: Number,
    default: 0,
  },
  gst: {
    type: Number,
    default: 0,
  },
  income_tax: {
    type: Number,
    default: 0,
  },
  pol: {
    type: Number,
    default: 0,
  },
  toll_tax: {
    type: Number,
    default: 0,
  },
  mobile_charges: {
    type: Number,
    default: 0,
  },
  photo_copy_charges: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
  },
  object_code: {
    type: String,
  },
  year_id: {
    type: Number,
    default: null,
  },
});

const billModel = mongoose.model("Bill", billSchema);

module.exports = billModel;
