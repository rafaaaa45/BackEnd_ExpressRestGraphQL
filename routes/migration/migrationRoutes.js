const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Pool } = require("pg");
const Companie = require("../../models/Companies.js");
const Location = require("../../models/Location");
const Office = require("../../models/Offices");

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

            await Location.findOneAndUpdate(
              { location: listagem_of.locationscompanies.location },
              {
                $set: { location: listagem_of.locationscompanies.location },
              },
              {
                //Caso não exista insere novo
                upsert: true,
                new: true,
                runValidators: true,
              }
            )
              .then((result) => {
                locationUpserted = result;
                console.log(locationUpserted);
              })
              .catch((error) => {
                insertError = true;
                let data = error.message;
                console.log(data);
              });

            const officeObject = {
              locationId: locationUpserted._id,
              companyId: companieUpserted._id,
              worker: listagem_of.workers,
            };

            await Office.findOneAndUpdate(
              {
                locationId: locationUpserted._id,
                companyId: companieUpserted._id,
              },
              {
                $set: officeObject,
              },
              {
                //Caso não exista insere novo
                upsert: true,
                new: true,
                runValidators: true,
              }
            )
              .then((result) => {
                console.log(result);
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
      }
    });
  });
});

module.exports = router;
