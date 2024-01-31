const mongoose = require("mongoose");
const billModel = require("../models/billModel");

const billService = async (activity_id) => {
  try {
    const pipeline = [
      {
        $match: {
          activity_id: new mongoose.Types.ObjectId(activity_id),
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          cost_used_by_bills: {
            $sum: "$items.bill_amount",
          },
        },
      },
    ];

    const result = await billModel.aggregate(pipeline);

    if (result.length > 0) {
      const costUsedByBills = result[0].cost_used_by_bills;
      return costUsedByBills;
    } else {
      return 0;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = billService;
