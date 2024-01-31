const billModel = require("../models/billModel");
const itemModel = require("../models/itemModel");
const billService = require("../services/billService");
const activityReleaseService = require("../services/activityReleaseService");

const createBill = async (req, res) => {
  try {
    let {
      project_id,
      activity_id,
      items,
      bill_id,
      payees_name,
      designation,
      city,
      payees_cnic,
      date,
      bill_amount,
      no_of_days,
      pst,
      gst,
      income_tax,
      pol,
      toll_tax,
      mobile_charges,
      photo_copy_charges,
      object_code,
      year_id,
    } = req.body;

    const cost_used_by_bills = await billService(activity_id);

    const total_activity_release_cost = await activityReleaseService(
      activity_id
    );

    const remainingBudget = cost_used_by_bills - total_activity_release_cost;

    let total = 0;

    for (let item of items) {
      let { item_id, bill_amount } = item;

      let foundedItem = await itemModel.findById(item_id);
      if (!foundedItem) {
        throw new Error(`Invalid ItemId:(${item_id}).`);
      }

      if (bill_amount > foundedItem.total_cost) {
        throw new Error(
          `Cannot add bill as it will exceed the item's budget: ${foundedItem.total_cost}.`
        );
      }

      total += bill_amount;
    }

    if (total + cost_used_by_bills > total_activity_release_cost) {
      throw new Error(
        `Cannot add bill as it will exceed the release budget: ${remainingBudget}.`
      );
    }

    const createdBill = await billModel.create({
      project_id: project_id,
      activity_id: activity_id,
      items: items,
      bill_id: bill_id,
      payees_name: payees_name,
      designation: designation,
      city: city,
      payees_cnic: payees_cnic,
      date: date,
      bill_amount: bill_amount,
      no_of_days: no_of_days,
      pst: pst,
      gst: gst,
      income_tax: income_tax,
      pol: pol,
      toll_tax: toll_tax,
      mobile_charges: mobile_charges,
      photo_copy_charges: photo_copy_charges,
      total: total,
      object_code: object_code,
      year_id: year_id,
    });

    res.status(200).json({ success: true, data: createdBill });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

module.exports = createBill;
