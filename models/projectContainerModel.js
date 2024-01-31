const mongoose = require("mongoose");

const projectContainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const projectContainerModel = mongoose.model(
  "ProjectContainer",
  projectContainerSchema
);

module.exports = projectContainerModel;
