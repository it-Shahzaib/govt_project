const mongoose = require("mongoose");

const projectModel = require("../models/projectModel");
const projectService = require("../services/projectService");

const readSpecificProject = async (req, res) => {
  try {
    const project_id = new mongoose.Types.ObjectId(req.params);

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId:(${project_id}).`);
    }

    const projectInfo = await projectService(project_id);

    res.status(200).json({ status: true, data: projectInfo });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

const editProjectPrice = async (req, res) => {
  try {
    const { project_id, newPrice } = req.body;

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId:(${project_id}).`);
    }

    const project_type = foundedProject.type;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(project_id),
        },
      },
      {
        $lookup: {
          from: "activities",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$project_id", "$$projectId"],
                },
              },
            },
          ],
          as: "related_activities",
        },
      },
      {
        $unwind: {
          path: "$related_activities",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          cost_used_by_activities: {
            $sum: "$related_activities.amount",
          },
        },
      },
    ];

    const cost_used_by_activities = await projectModel.aggregate(pipeline);

    if (newPrice < cost_used_by_activities) {
      throw new Error(`Cannot update project price.`);
    }

    if (project_type === "GOP") {
      updatedFields = { approved_cost_gop: newPrice };
    } else {
      updatedFields = { approved_cost_foreign_funded: newPrice };
    }

    const updatedPrice = await projectModel.findByIdAndUpdate(
      project_id,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).send({ status: true, data: updatedPrice });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = { readSpecificProject, editProjectPrice };
