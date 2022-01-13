const crypto = require("crypto");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

//pool Postgres
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "12345",
  port: "5432",
  database: "IS_TP1",
  max: 20,
});

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

const idFiles = async () => {
  let response;
  try {
    response = await pool.query("Select * from allFiles;");
    return response.rows;
  } catch (error) {
    return false;
  }
};

exports.encryptSha512 = encryptSha512;
exports.createJWT = createJWT;
exports.Tipos = Tipos;
exports.isValidTipo = isValidTipo;
exports.idFiles = idFiles;
