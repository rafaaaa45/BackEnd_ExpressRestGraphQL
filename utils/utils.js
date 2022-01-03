const crypto = require("crypto");
const res = require("express/lib/response");
const Office = require("../models/Offices");
const Location = require("../models/Location");
const Companie = require("../models/Companies");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");

const Tipos = {
  ADMIN: "admin",
  EDIT: "edit",
  VIEW: "view",
};

const encryptSha512 = (password) => {
  let encryptedPW;

  encryptedPW = crypto.createHash("sha512").update(password).digest("hex");

  return encryptedPW;
};

const getLocation = async (location) => {
  let loc;

  await Location.findOne({ location })
    .then((result) => {
      if (result) {
        loc = result;
      } else {
        //cria o novo objeto de Location caso não exista
        loc = new Location({
          location: location,
        });
        loc.save();
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    });

  return loc;
};

const getCompanie = async (companie) => {
  let com;

  await Companie.findOne({ companie })
    .then((result) => {
      if (result) {
        com = result;
      } else {
        //cria o novo objeto de Location caso não exista
        com = new Companie({
          companie: companie,
        });
        com.save();
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    });

  return com;
};

const createJWT = (id, email, tipo) => {
  let newToken;

  newToken = jwt.sign(
    { user_id: id, email: email, tipo: tipo },
    process.env.TOKEN_KEY,
    {
      expiresIn: "1h",
    }
  );

  return newToken;
};

const isValidTipo = (tipo) => {
  if (tipo != (Tipos.ADMIN || Tipos.EDIT || Tipos.VIEW)) {
    return false;
  }
  return true;
};

exports.encryptSha512 = encryptSha512;
exports.createJWT = createJWT;
exports.getCompanie = getCompanie;
exports.getLocation = getLocation;
exports.Tipos = Tipos;
exports.isValidTipo = isValidTipo;
