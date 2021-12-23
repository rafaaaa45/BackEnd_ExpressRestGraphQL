const mongoose = require("mongoose");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");

const OfficesSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  locationId: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  worker: [
    {
      totalyearlycompensation: Number,
      monthlysalary: Number,
      yearsofexperience: Number,
      yearsatcompany: Number,
      tag_id: String,
    },
  ],
});

module.exports = mongoose.model("OfficesSchema", OfficesSchema);
