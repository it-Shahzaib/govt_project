const mongoose = require("mongoose");
const activityModel = require("../models/activityModel");

const activityService = async (activity_id) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(activity_id),
        },
      },
      {
        $lookup: {
          from: "items",
          let: { activityId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$activity_id", "$$activityId"],
                },
              },
            },
          ],
          as: "related_items",
        },
      },
      {
        $unwind: {
          path: "$related_items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          cost_used_by_items: {
            $sum: "$related_items.total_cost",
          },
        },
      },
    ];

    const result = await activityModel.aggregate(pipeline);

    if (result.length > 0) {
      const costUsedByItems = result[0].cost_used_by_items;
      return costUsedByItems;
    } else {
      return 0;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = activityService;
