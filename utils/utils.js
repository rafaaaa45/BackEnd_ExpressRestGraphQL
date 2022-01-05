const crypto = require("crypto");
// const res = require("express/lib/response");
// const Office = require("../models/Offices");
const Location = require("../models/Location");
// const Tag = require("../models/Tags");
// const Companie = require("../models/Companies");
// const { nextTick } = require("process");

const jwt = require("jsonwebtoken");

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

const getLocation = async (location) => {
  let loc;

  await Location.findOne({ _id: location })
    .then((result) => {
      if (result) {
        loc = result;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return loc;
};

/* const getCompanie = async (companie) => {
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
    });

  return com;
}; */

/* const getTag = async (tag) => {
  let t;

  await Tag.findOne({ tag })
    .then((result) => {
      if (result) {
        t = result;
      } else {
        //cria o novo objeto de Location caso não exista
        t = new Tag({
          tag: tag,
        });
        t.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return t;
}; */

exports.encryptSha512 = encryptSha512;
exports.createJWT = createJWT;
exports.Tipos = Tipos;
exports.isValidTipo = isValidTipo;
//exports.getCompanie = getCompanie;
exports.getLocation = getLocation;
//exports.getTag = getTag;
