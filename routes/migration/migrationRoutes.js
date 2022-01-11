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

//variáveis globais

let countInserted = 0;
let totalToInsert = 0;
let isLocked = false;

router.get("/startMigration", async (req, res) => {
  const getOffices = `select listagem_of();`;

  let insertError = false;
  if (!isLocked) {
    isLocked = true;

    pool.connect((err, client, done) => {
      if (err) {
        return res.json({ isSuccess: false, data: "Erro na Conexão" });
      }

      client.query(getOffices, async (err, response) => {
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
                  countInserted = countInserted + 1;
                  companieUpserted = result;
                  // console.log(companieUpserted);
                })
                .catch((error) => {
                  insertError = true;
                  let data = error.message;
                  console.log("Erro ao Inserir Companie" + data);
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
                  countInserted = countInserted + 1;
                  locationUpserted = result;
                  // console.log(locationUpserted);
                })
                .catch((error) => {
                  insertError = true;
                  let data = error.message;
                  console.log("Erro ao Inserir Location" + data);
                });

              const officeObject = {
                locationId: locationUpserted._id,
                companyId: companieUpserted._id,
                worker: listagem_of.workers,
              };

              // console.log(listagem_of.workers);
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
                  countInserted = countInserted + 1;
                  // console.log(result);
                })
                .catch((error) => {
                  insertError = true;
                  let data = error.message;
                  console.log("Erro ao Inserir Office" + data);
                });
            })
          ).then(() => {
            //permitir de novo fazer importações
            isLocked = false;

            //se ocorreu um erro ou mal
            if (insertError) {
              return res.json({
                isSuccess: false,
                data: "Erro na Importação!",
              });
            } else {
              totalInserted = countInserted;
              countInserted = 0;

              return res.json({
                isSuccess: true,
                data: `Importação concluída, foram inseridos ${totalInserted} registos!`,
              });
            }
          });
        }
      });
    });
  } else {
    return res.json({
      isSuccess: false,
      data: `Já está a decorrer uma Importação! Espere até terminir a Importação atual.`,
    });
  }
});

router.get("/migrationState", async (req, res) => {
  const countOffices = `Select * from countOffices;`;
  if (isLocked) {
    pool.connect((err, client, done) => {
      if (err) {
        return res.json({ isSuccess: false, data: "Erro na Conexão" });
      }
      client.query(countOffices, (err, response) => {
        done();

        if (err) {
          console.log(err);
          return res.json({
            isSuccess: false,
            data: "Erro ao obter o estado da Importação",
          });
        } else {
          totalToInsert = response.rows[0].count;

          let percentagemAtual = (countInserted * 100) / totalToInsert;

          console.log("total para inserir " + totalToInsert);

          console.log("totais inseridos" + countInserted);

          totalToInsert = 0;
          return res.json({
            isSuccess: true,
            data: `Encontra se a decorrer uma Importação, percentagem de conclusão : ${percentagemAtual.toFixed(
              2
            )} %`,
          });
        }
      });
    });
  } else {
    return res.json({
      isSuccess: false,
      data: "Não existem importações a decorrer",
    });
  }
});

module.exports = router;
