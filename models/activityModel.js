const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  object_code: {
    type: String,
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
