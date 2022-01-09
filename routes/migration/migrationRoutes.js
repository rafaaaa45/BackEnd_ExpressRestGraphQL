const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Pool } = require("pg");

//pool Postgres
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "12345",
  port: "5432",
  database: "IS_TP1",
  max: 20,
});

router.get("/migrate", async (req, res) => {
  const query = `select listagem_of();`;

  pool.connect((err, client, done) => {
    if (err) {
      return res.json({ isSuccess: false, data: "Erro na Conexão" });
    }
    client.query(query, (err, response) => {
      done();
      if (err) {
        console.log(err);
        return res.json({ isSuccess: false, data: "Erro na Migração" });
      } else {
        console.log(
          response.rows[0].listagem_of.workers[0].totalyearlycompensation.trim()
        );

        res.send(
          response.rows[0].listagem_of.workers[0].totalyearlycompensation
        );

        //upsert location

        // upsert company

        //create office with the workers trim

        //por fim res.send com suceso ou não
      }
    });
  });
});

module.exports = router;
