const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.send("Necessita de um token para Autenticar!");
  }
  try {
    const decodedToken = jwt.verify(token, config.TOKEN_KEY);
    req.user = decodedToken;
  } catch (err) {
    return res.send("Token Inválido!");
  }
  return next();
};

//recebe um arrray com as roles que são permitidas no endpoint,
//no caso de serem todas permitidas recebe a string "any"
const verifyRole = (roles) => {
  return (req, res, next) => {
    //se não existir no array de roles e for diferente de any
    if (!roles.includes(req.user.tipo) && roles !== "any") {
      return res.send("Não tem Permissão!");
    }
    return next();
  };
};

exports.verifyToken = verifyToken;
exports.verifyAdmin = verifyRole([utils.Tipos.ADMIN]);
exports.verifyAdmin_Edit = verifyRole([utils.Tipos.ADMIN, utils.Tipos.EDIT]);
exports.verifyAny = verifyRole("any");
