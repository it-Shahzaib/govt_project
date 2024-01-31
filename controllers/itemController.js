const mongoose = require("mongoose");

const activityModel = require("../models/activityModel");
const itemModel = require("../models/itemModel");
const activityService = require("../services/activityService");
const billModel = require("../models/billModel");

const createItem = async (req, res) => {
  try {
    const owner = req.user._id;

    const {
      name,
      quantity,
      unit_defined,
      total_cost,
      unit_cost,
      object_code,
      activity_id,
      year_id,
    } = req.body;

    const foundedActivity = await activityModel.findById(activity_id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId:(${activity_id})`);
    }

    const cost_used_by_items = await activityService(activity_id);

    if (total_cost + cost_used_by_items > foundedActivity.amount) {
      throw new Error(
        `Cannot add item as it will exceed the cost of the activity which is:(${foundedActivity.amount}).`
      );
    }

    const createdItem = await itemModel.create({
      name: name,
      quantity: quantity,
      unit_defined: unit_defined,
      total_cost: total_cost,
      unit_cost: unit_cost,
      object_code: object_code,
      owner: owner,
      activity_id: activity_id,
      year_id: year_id,
    });

    res.status(200).send({ success: true, data: createdItem });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const {
      id,
      name,
      quantity,
      unit_defined,
      total_cost,
      unit_cost,
      object_code,
      activity_id,
      year_id,
    } = req.body;

    const foundedItem = await itemModel.findById(id);

    if (!foundedItem) {
      throw new Error(`Invalid ItemId:(${id}).`);
    }

    const foundedActivity = await activityModel.findById(activity_id);

    if (!foundedActivity) {
      throw new Error(`Invalid ActivityId:(${activity_id}).`);
    }

    const cost_used_by_items = await activityService(activity_id);

    const updated_cost_used_by_items =
      cost_used_by_items - foundedItem.total_cost;

    if (total_cost + updated_cost_used_by_items > foundedActivity.amount) {
      throw new Error(
        `Cannot update item as it will exceed the cost of the activity which is:(${foundedActivity.amount}).`
      );
    }

    const updatedItem = await itemModel.findByIdAndUpdate(
      id,
      {
        name: name,
        quantity: quantity,
        unit_defined: unit_defined,
        total_cost: total_cost,
        unit_cost: unit_cost,
        object_code: object_code,
        owner: owner,
        activity_id: activity_id,
        year_id: year_id,
      },
      { new: true }
    );

    res.status(200).send({ success: true, data: updatedItem });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.body;

    const foundedItem = await itemModel.findById(id);

    if (!foundedItem) {
      throw new Error(`Invalid ItemId${id}`);
    }

    const pipeline = [
      {
        $match: {
          "items.item_id": new mongoose.Types.ObjectId(id),
        },
      },
    ];

    const relatedBills = await billModel.aggregate(pipeline);

    if (relatedBills.length > 0) {
      throw new Error("Cannot delete item as some bills are created on this");
    }

    const deletedItem = await itemModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = { createItem, updateItem, deleteItem };
