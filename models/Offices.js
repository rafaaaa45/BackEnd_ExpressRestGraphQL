const mongoose = require("mongoose");
const WorkerSchema = require("./Workers");
//guid, ids gerado
const { v4: uuidv4 } = require("uuid");
const { UUIDv4 } = require("uuid-v4-validator");

const OfficesSchema = mongoose.Schema({
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
  locationId: {
    type: String,
    ref: "locations",
    required: [true, "É obrigatório inserir nome da Localização"],
  },
  companyId: {
    type: String,
    ref: "Companies",
    required: [true, "É obrigatório inserir nome da Company"],
  },
  workers: [WorkerSchema],
});

module.exports = mongoose.model("officesschema", OfficesSchema);
