const mongoose = require("mongoose");
const projectModel = require("../models/projectModel");

const readProjectService = async (project_id) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(project_id),
        },
      },
      {
        $lookup: {
          from: "projectcontainers",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$projectId", "$projects"],
                },
              },
            },
          ],
          as: "related_project_container",
        },
      },
      {
        $unwind: {
          path: "$related_project_container",
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
                  $eq: ["$$projectId", "$project_id"],
                },
              },
            },
            {
              $lookup: {
                from: "items",
                let: { activityIds: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$$activityIds", "$activity_id"],
                      },
                    },
                  },
                ],
                as: "related_activity_items",
              },
            },
            {
              $lookup: {
                from: "bills",
                let: { activityId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$$activityId", "$activity_id"],
                      },
                    },
                  },
                ],
                as: "related_activity_bills",
              },
            },
            {
              $addFields: {
                related_bills_cost: {
                  $sum: "$related_activity_bills.total",
                },
              },
            },
          ],
          as: "related_activities",
        },
      },
      {
        $lookup: {
          from: "projectreleases",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$projectId", "$project_id"],
                },
              },
            },
          ],
          as: "related_project_releases",
        },
      },
      {
        $unwind: {
          path: "$related_project_releases",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "activityreleases",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$projectId", "$project_id"],
                },
              },
            },
          ],
          as: "related_activities_releases",
        },
      },
      {
        $project: {
          name: {
            $concat: ["$related_project_container.name", "-", "$type"],
          },
          related_activities: "$related_activities",
          projectReleases: "$related_projects_releases",
          activityReleases: "$related_activities_releases",
          approved_cost_total: {
            $sum: ["$approved_cost_foreign_funded", "$approved_cost_gop"],
          },
          approved_cost_related_to_type: {
            $cond: {
              if: { $eq: ["$type", "GOP"] },
              then: "$approved_cost_gop",
              else: "$approved_cost_foreign_funded",
            },
          },
          cost_used_by_activities: {
            $sum: "$related_activities.amount",
          },
          released_amount: {
            $sum: "$related_project_releases.release_amount",
          },
          remaining_budget: {
            $subtract: [
              { $sum: "$related_project_releases.release_amount" },
              { $sum: "$related_activities.related_bills_cost" },
            ],
          },
          _id: 0,
        },
      },
    ];

    const result = await projectModel.aggregate(pipeline);

    if (result.length > 0) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = readProjectService;
