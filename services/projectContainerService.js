const projectModel = require("../models/projectModel");
const projectContainerModel = require("../models/projectContainerModel");

const projectContainerService = async (req, owner) => {
  try {
    const {
      types,
      name,
      approved_cost_foreign_funded,
      approved_cost_gop,
      start_date,
      end_date,
    } = req.body;

    if (types.length === 0) {
      throw new Error("Please provide any of the types");
    }

    const createdProjects = [];
    const createdProjectsId = [];

    for (let type of types) {
      const create = await projectModel.create({
        type: type,
        approved_cost_foreign_funded: approved_cost_foreign_funded,
        approved_cost_gop: approved_cost_gop,
        start_date: start_date,
        end_date: end_date,
      });

      createdProjects.push(create);
      createdProjectsId.push(create._id);
    }

    const projectContainer = await projectContainerModel.create({
      name: name,
      owner: owner,
      projects: createdProjectsId,
    });

    return projectContainer;
  } catch (err) {
    console.error("Error creating:", err.message);
  }
};

module.exports = projectContainerService;
