const mongoose = require("mongoose");

const {
  projectTypes,
  projectTypesArray,
} = require("../config/projectConstants");

const projectSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: projectTypesArray,
    required: true,
  },
  approved_cost_gop: {
    type: Number,
  },
  approved_cost_foreign_funded: {
    type: Number,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
});

const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;
