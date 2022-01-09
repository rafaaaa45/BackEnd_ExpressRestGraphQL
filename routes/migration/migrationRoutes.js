const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Pool } = require("pg");
const Companie = require("../../models/Companies.js");
const { isUnionType } = require("graphql");

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
  let insertError = false;

  pool.connect((err, client, done) => {
    if (err) {
      return res.json({ isSuccess: false, data: "Erro na Conexão" });
    }

    client.query(query, async (err, response) => {
      done();
      if (err) {
        console.log(err);
        return res.json({ isSuccess: false, data: "Erro na Migração" });
      } else {
        Promise.all(
          response.rows.map(async (office) => {
            const { listagem_of } = office;
            let companieUpserted;
            let locationUpserted;

            await Companie.findOneAndUpdate(
              { companie: listagem_of.locationscompanies.companie },
              {
                $set: { companie: listagem_of.locationscompanies.companie },
              },
              {
                //Caso não exista insere novo
                upsert: true,
                runValidators: true,
                new: true,
              }
            )
              .then((result) => {
                companieUpserted = result;
              })
              .catch((error) => {
                insertError = true;
                let data = error.message;
                console.log(data);
              });
          })
        ).then(() => {
          //se ocorreu um erro ou mal
          if (insertError) {
            console.log("correu mal");
          } else {
            console.log("correu bem");
          }
        });

        //create office with the workers trim

        //por fim res.send com suceso ou não
        // res.send(
        //   response.rows[0].listagem_of.workers[0].totalyearlycompensation
        // );
      }
    });
  });
});

module.exports = router;
