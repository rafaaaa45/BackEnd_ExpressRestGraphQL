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
    const locationId = req.body.location;
    const companyId = req.body.companie;
    const office = {
      locationId: locationId,
      companyId: companyId,
    };

    await Office.findOneAndUpdate(
      { locationId: locationId, companyId: companyId },
      {
        $set: office,
      },
      {
        //Caso não exista insere novo
        upsert: true,
      }
    )
      .then((result) => {
        if (result) {
          res.json({ isSuccess: false, data: result });
        } else {
          res.json({ isSuccess: true, data: "Novo office criado" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

router.put(
  "/createWorker",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const worker = {
      totalyearlycompensation: req.body.totalyearlycompensation,
      monthlysalary: req.body.monthlysalary,
      yearsofexperience: req.body.yearsofexperience,
      yearsatcompany: req.body.yearsatcompany,
      tag_id: req.body.tag,
    };

    let office = await Office.findOne({ id });
    office.worker.push(worker);
    office
      .save()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

router.put(
  "/updateWorker",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const idWorker = req.query.idWorker;
    const idOffice = req.query.idOffice;

    const worker = {
      "worker.$.totalyearlycompensation": req.body.totalyearlycompensation,
      "worker.$.monthlysalary": req.body.monthlysalary,
      "worker.$.yearsofexperience": req.body.yearsofexperience,
      "worker.$.yearsatcompany": req.body.yearsatcompany,
      "worker.$.tag_id": req.body.tag,
    };

    await Office.update(
      { _id: idOffice, "worker._id": idWorker },
      {
        $set: worker,
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

router.put(
  "/updateOffice",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const locationId = req.body.location;
    const companyId = req.body.companie;

    const officeUpdated = {
      locationId: locationId,
      companyId: companyId,
    };

    await Office.findOneAndUpdate(
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
          res.json({
            isSuccess: false,
            data: "ID não existe, foi criado um novo Office",
          });
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

    await Office.deleteOne({ _id: id })
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
