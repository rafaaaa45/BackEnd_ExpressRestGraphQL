const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Pool } = require("pg");
const Companie = require("../../models/Companies.js");
const Location = require("../../models/Location");
const Office = require("../../models/Offices");
const Tag = require("../../models/Tags");
const utils = require("../../utils/utils");

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
  const getOffices = `select listagem_offices($1);`;

  if (!isLocked) {
    isLocked = true;
    let idFicheiros = await utils.idFiles();

    Promise.all(
      idFicheiros.map(async (ficheiro) => {
        try {
          response = await pool.query(getOffices, [ficheiro.id]);

          console.log(response);
          for (const office of response.rows) {
            const { locationscompanies, workers } = office.listagem_offices;
            let companieUpserted;
            let locationUpserted;
            let officeUpserted;

            await Companie.findOneAndUpdate(
              { companie: locationscompanies.companie },
              {
                $set: { companie: locationscompanies.companie },
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
                countInserted = 0;
                totalToInsert = 0;
                isLocked = false;

                return res.json({
                  isSuccess: false,
                  data: "Erro na migração ao inserir Companie",
                });
              });

            await Location.findOneAndUpdate(
              { location: locationscompanies.location },
              {
                $set: { location: locationscompanies.location },
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
                countInserted = 0;
                totalToInsert = 0;
                isLocked = false;

                return res.json({
                  isSuccess: false,
                  data: "Erro na migração ao inserir Location",
                });
              });

            //trocar pela respetiva tag
            for (const singleWorker of workers) {
              let insertedTag;

              const tag = {
                tag: singleWorker.tag_id,
              };

              await Tag.findOneAndUpdate(
                { tag: singleWorker.tag_id },
                {
                  $set: tag,
                },

                {
                  upsert: true,
                }
              )
                .then((result) => {
                  insertedTag = result;
                  countInserted = countInserted + 1;
                  // console.log(result);
                })
                .catch((error) => {
                  countInserted = 0;
                  totalToInsert = 0;
                  isLocked = false;

                  return res.json({
                    isSuccess: false,
                    data: "Erro na migração ao inserir Tag",
                  });
                });

              singleWorker.tag_id = insertedTag._id;
            }

            const officeObject = {
              locationId: locationUpserted._id,
              companyId: companieUpserted._id,
              workers: workers,
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
                countInserted = countInserted + 1;
                officeUpserted = result;
              })
              .catch((error) => {
                countInserted = 0;
                totalToInsert = 0;
                isLocked = false;
                return res.json({
                  isSuccess: false,
                  data: "Erro na migração ao inserir Office",
                });
              });
          }
        } catch {
          countInserted = 0;
          totalToInsert = 0;
          isLocked = false;

          return res.json({
            isSuccess: false,
            data: "Erro na migração ",
          });
        }
      })
    ).then(() => {
      //return when finished
      countInserted = 0;
      totalToInsert = 0;
      isLocked = false;

      return res.json({
        isSuccess: true,
        data: "Migração Concluida",
      });
    });
  } else {
    return res.json({
      isSuccess: false,
      data: `Já está a decorrer uma Importação! Espere até terminir a Importação atual.`,
    });
  }
});

//done
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
