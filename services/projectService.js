const mongoose = require("mongoose");
const projectModel = require("../models/projectModel");

const projectService = async (project_id) => {
  try {
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

    const result = await projectModel.aggregate(pipeline);

    if (result.length > 0) {
      return result[0].cost_used_by_activities;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = projectService;
