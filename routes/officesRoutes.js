const express = require("express");
const router = express.Router();
const Office = require("../models/Offices");
const Location = require("../models/Location");
const Companie = require("../models/Companies");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyRole("any"), async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Office.findOne({ id })
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "ID não encontrado" });
      });
  } else {
    await Office.find()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
});

router.post(
  "/createOffice",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const location = await utils.getLocation(req.body.location);
    const company = await utils.getCompanie(req.body.companie);
    const locationId = location._id;
    const companyId = company._id;
    let office;

    // Verificar se existe office com esta localização e empresa
    await Office.findOne({ locationId, companyId })
      .then((result) => {
        if (result) {
          office = result;
        } else {
          office = new Office({
            locationId: locationId,
            companyId: companyId,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });

    try {
      const createdOffice = await office.save();
      res.json({ isSuccess: true, data: createdOffice });
    } catch (err) {
      console.log(err);
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    }
  }
);

router.put(
  "/updateOffice",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const location = await utils.getLocation(req.body.location);
    const company = await utils.getCompanie(req.body.companie);
    const locationId = location._id;
    const companyId = company._id;
    let officeUpdated;

    // Verificar se existe office com esta localização e empresa
    await Office.findOne({ locationId, companyId })
      .then((result) => {
        if (result) {
          res.json({
            isSuccess: false,
            data: "O Office para o qual tentou editar já existe",
          });
        } else {
          officeUpdated = {
            locationId: locationId,
            companyId: companyId,
          };
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });

    Office.findOneAndUpdate(
      { _id: id },
      {
        $set: officeUpdated,
      },
      {
        //Caso não exista id insere novo
        upsert: true,
      }
    )
      .then((result) => {
        if (result) {
          res.json({ isSuccess: true, data: result });
        } else {
          res.json({ isSuccess: false, data: "ID não existe" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

router.delete(
  "/deleteOffice",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    Office.deleteOne({ _id: id })
      .then((result) => {
        if (result) {
          res.json({ isSuccess: true, data: result });
        } else {
          res.json({ isSuccess: false, data: "ID não existe" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

module.exports = router;
