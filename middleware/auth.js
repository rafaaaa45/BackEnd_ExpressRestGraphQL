const req = require("express/lib/request");
const jwt = require("jsonwebtoken");

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
    console.log(req.user);
  } catch (err) {
    return res.send("Token Inválido!");
  }
  return next();
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      res.send("Não tem Permissão!");
    }
    next();
  };
};

exports.verifyToken = verifyToken;
exports.verifyRole = verifyRole;
