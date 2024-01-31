const mongoose = require("mongoose");

const projectReleaseModel = require("../models/projectReleaseModel");
const projectModel = require("../models/projectModel");
const activityReleaseModel = require("../models/activityReleaseModel");
const projectReleaseService = require("../services/projectReleaseService");

const createRelease = async (req, res) => {
  try {
    const { release_amount, release_date, project_id } = req.body;

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId:(${project_id}).`);
    }

    const total_release_cost = await projectReleaseService(project_id);

    const approved_cost =
      foundedProject.type === "GOP"
        ? foundedProject.approved_cost_gop
        : foundedProject.approved_cost_foreign_funded;

    if (release_amount + total_release_cost > approved_cost) {
      throw new Error(
        `Total release amount exceeds the project approved cost.`
      );
    }

    const createdRelease = await projectReleaseModel.create({
      release_amount: release_amount,
      release_date: release_date,
      project_id: project_id,
    });

    res.status(200).send({ success: true, data: createdRelease });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const readRelease = async (req, res) => {
  try {
    const project_id = new mongoose.Types.ObjectId(req.params);

    const pipeline = [
      {
        $match: {
          project_id: project_id,
        },
      },
      {
        $group: {
          _id: null,
          releases: {
            $push: {
              amount: "$release_amount",
              date: "$release_date",
            },
          },
          total_release_cost: { $sum: "$release_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          releases: 1,
          total_release_cost: 1,
        },
      },
    ];

    const result = await projectReleaseModel.aggregate(pipeline);

    res.status(200).send({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const getUnallocatedRelease = async (req, res) => {
  try {
    const project_id = new mongoose.Types.ObjectId(req.params);

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId:(${project_id}).`);
    }

    const total_release_cost = await projectReleaseService(project_id);

    const pipeline = [
      {
        $match: {
          project_id: project_id,
        },
      },
      {
        $group: {
          _id: null,
          total_activity_release_cost: {
            $sum: "$release_amount",
          },
        },
      },
    ];

    const total_activity_release_cost = await activityReleaseModel.aggregate(
      pipeline
    );

    const total_unallocated_release_cost =
      total_release_cost -
      total_activity_release_cost[0].total_activity_release_cost;

    res
      .status(200)
      .json({ success: true, data: total_unallocated_release_cost });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = { createRelease, readRelease, getUnallocatedRelease };
