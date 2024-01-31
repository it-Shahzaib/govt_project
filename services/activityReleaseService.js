const mongoose = require("mongoose");

const activityReleaseModel = require("../models/activityReleaseModel");
const activityModel = require("../models/activityModel");

const activityReleaseService = async (activity_id) => {
  try {
    const foundedActivity = await activityModel.findById(activity_id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId${activity_id}`);
    }

    const pipeline = [
      {
        $match: {
          activity_id: new mongoose.Types.ObjectId(activity_id),
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

    const result = await activityReleaseModel.aggregate(pipeline);

    if (result.length > 0) {
      const activityReleaseCost = result[0].total_activity_release_cost;
      return activityReleaseCost;
    } else {
      return 0;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = activityReleaseService;
