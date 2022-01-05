//guid, ids gerado
const { v4: uuidv4 } = require("uuid");
const { UUIDv4 } = require("uuid-v4-validator");

const WorkerSchema = {
  _id: {
    type: String,
    default: uuidv4,
    validate: {
      isAsync: true,
      validator: function (value) {
        return UUIDv4.validate(value);
      },
      message: function (props) {
        return `${props.value} is not a valid GUID`;
      },
    },
  },
  totalyearlycompensation: Number,
  monthlysalary: Number,
  yearsofexperience: Number,
  yearsatcompany: Number,
  tag_id: {
    type: String,
    ref: "tags",
  },
};

module.exports = WorkerSchema;
