const mongoose = require("mongoose");

const projectReleaseSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  release_amount: {
    type: Number,
    required: true,
  },
  release_date: {
    type: Date,
    default: Date.now,
  },
});

const projectReleaseModel = mongoose.model(
  "ProjectRelease",
  projectReleaseSchema
);

module.exports = projectReleaseModel;
