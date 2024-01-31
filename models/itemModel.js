const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "activity",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  unit_defined: {
    type: String,
  },
  total_cost: {
    type: Number,
  },
  unit_cost: {
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

const itemModel = mongoose.model("Item", itemSchema);

module.exports = itemModel;
