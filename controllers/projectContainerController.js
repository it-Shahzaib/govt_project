const projectContainerModel = require("../models/projectContainerModel");
const projectContainerService = require("../services/projectContainerService");

const createProjectContainer = async (req, res) => {
  try {
    const owner = req.user._id;

    const createdProjectContainer = await projectContainerService(req, owner);

    if (createdProjectContainer) {
      res.status(200).send({ status: true, data: createdProjectContainer });
    } else {
      throw new Error("Error creating project container");
    }
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const readAllProjectContainers = async (req, res) => {
  try {
    const getProjectContainers = await projectContainerModel.find();

    const containersName = getProjectContainers.map(
      (container) => container.name
    );

    res.status(200).json({ status: true, data: containersName });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = {
  createProjectContainer,
  readAllProjectContainers,
};
