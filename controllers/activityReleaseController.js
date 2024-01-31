const activityReleaseModel = require("../models/activityReleaseModel");
const activityModel = require("../models/activityModel");

const projectReleaseService = require("../services/projectReleaseService");
const activityReleaseService = require("../services/activityReleaseService");
const billService = require("../services/billService");

const createActivityRelease = async (req, res) => {
  try {
    const { project_id, activity_id, release_amount, release_date } = req.body;

    const foundedActivity = await activityModel.findById(activity_id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId(${foundedActivity}).`);
    }

    const total_release_cost = await projectReleaseService(project_id);

    const total_activity_release_cost = await activityReleaseService(
      activity_id
    );

    const totalUnallocatedRelease =
      total_release_cost - total_activity_release_cost;

    const remaining_budget =
      foundedActivity.amount - total_activity_release_cost;

    if (release_amount > totalUnallocatedRelease) {
      throw new Error(
        `Cannot create release as remaining release budget is: ${totalUnallocatedRelease}.`
      );
    }

    if (release_amount > remaining_budget) {
      throw new Error(
        `Cannot create release as it will exceed the budget of the activity.`
      );
    }

    const createdRelease = await activityReleaseModel.create({
      release_amount: release_amount,
      release_date: release_date,
      project_id: project_id,
      activity_id: activity_id,
    });

    res.status(200).send({ status: true, data: createdRelease });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const editRelease = async (req, res) => {
  try {
    const { project_id, activity_id, id, new_release_amount } = req.body;

    const foundedActivity = await activityModel.findById(activity_id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId:(${activity_id}).`);
    }

    const existingRelease = await activityReleaseModel.findById(id);

    if (!existingRelease) {
      throw new Error(`Invalid Activity Release Id:(${id}).`);
    }

    const total_release_cost = await projectReleaseService(project_id);

    const cost_used_by_bills = await billService(activity_id);

    console.log("Cost used by bills:", cost_used_by_bills);

    if (new_release_amount > total_release_cost) {
      throw new Error(
        `Cannot update release as it will exceed the cost of project release`
      );
    }

    if (new_release_amount < cost_used_by_bills) {
      throw new Error(
        `Cannot update release as it is spanning over some bills`
      );
    }

    const updatedRelease = await activityReleaseModel.findByIdAndUpdate(
      id,
      {
        $set: {
          release_amount: new_release_amount,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ status: true, data: updatedRelease });
  } catch (err) {
    res.status(400).json({ status: true, error: err.message });
  }
};

module.exports = { createActivityRelease, editRelease };
