const mongoose = require("mongoose");

const projectModel = require("../models/projectModel");
const activityModel = require("../models/activityModel");
const itemModel = require("../models/itemModel");
const projectService = require("../services/projectService");

const createActivity = async (req, res) => {
  try {
    const { name, amount, object_code, project_id } = req.body;

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId(${project_id}).`);
    }

    const cost_used_by_activites = await projectService(project_id);

    const project_type = foundedProject.type;
    const approved_cost =
      project_type === "GOP"
        ? foundedProject.approved_cost_gop
        : foundedProject.approved_cost_foreign_funded;

    if (amount + cost_used_by_activites > approved_cost) {
      throw new Error(
        `Cannot add activity as it will exceed the approved cost of the project`
      );
    }

    const createdActivity = await activityModel.create({
      name: name,
      amount: amount,
      object_code: object_code,
      project_id: foundedProject._id,
    });

    res.status(200).send({ status: true, data: createdActivity });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id, name, amount, object_code } = req.body;

    const foundedActivity = await activityModel.findById(id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId(${id}).`);
    }

    const project_id = foundedActivity.project_id;

    const foundedProject = await projectModel.findById(project_id);

    if (!foundedProject) {
      throw new Error(`Invalid ProjectId(${project_id}).`);
    }

    const cost_used_by_activities = await projectService(project_id);

    const updated_cost_used_by_activities =
      cost_used_by_activities - foundedActivity.amount;

    const project_type = foundedProject.type;
    const approved_cost =
      project_type === "GOP"
        ? foundedProject.approved_cost_gop
        : foundedProject.approved_cost_foreign_funded;

    if (amount + updated_cost_used_by_activities > approved_cost) {
      throw new Error(
        `Cannot update activity as it will exceed the approved cost of the project`
      );
    }

    const updateObject = {
      name: name || foundedActivity.name,
      amount: amount || foundedActivity.amount,
      object_code: object_code || foundedActivity.object_code,
    };

    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true }
    );

    res.status(200).send({ status: true, data: updatedActivity });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.body;

    const foundedActivity = await activityModel.findById(id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId(${id}).`);
    }

    const pipeline = [
      {
        $match: {
          activity_id: new mongoose.Types.ObjectId(id),
        },
      },
    ];

    const related_items = await itemModel.aggregate(pipeline);

    if (related_items.length > 0) {
      throw new Error(
        `Cannot delete activity as it is spanning over some items`
      );
    }

    const deletedActivity = await activityModel.findByIdAndDelete(id, {
      foundedActivity,
    });

    res.status(200).json({ status: true, message: "Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = { createActivity, updateActivity, deleteActivity };
