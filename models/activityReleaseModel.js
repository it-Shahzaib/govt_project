const mongoose = require("mongoose");

const activityReleaseSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  activity_id: {
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

const activityReleaseModel = mongoose.model(
  "ActivityRelease",
  activityReleaseSchema
);

module.exports = activityReleaseModel;
