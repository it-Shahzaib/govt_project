const mongoose = require("mongoose");

const projectReleaseModel = require("../models/projectReleaseModel");

const projectReleaseService = async (project_id) => {
  try {
    const pipeline = [
      {
        $match: {
          project_id: new mongoose.Types.ObjectId(project_id),
        },
      },
      {
        $group: {
          _id: null,
          total_release_cost: {
            $sum: "$release_amount",
          },
        },
      },
    ];

    const result = await projectReleaseModel.aggregate(pipeline);

    if (result.length > 0) {
      const releaseCost = result[0].total_release_cost;
      return releaseCost;
    } else {
      return 0;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = projectReleaseService;
