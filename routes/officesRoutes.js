const express = require("express");
const router = express.Router();
const Office = require("../models/Offices");
const Location = require("../models/Location");
const Companie = require("../models/Companies");
const Tag = require("../models/Tags");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyAny, async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Office.findById(id)
      .populate("locationId")
      .populate("companyId")
      .populate("workers.tag_id")
      .then((result) => {
        if (result !== null) {
          res.json({ isSuccess: true, data: result });
        } else {
          res.json({ isSuccess: false, data: "Office não encontrado" });
        }
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  } else {
    await Office.find()
      .populate("locationId")
      .populate("companyId")
      .populate("workers.tag_id")
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
});

router.post(
  "/createOffice",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const locationId = req.body.location;
    const companyId = req.body.companie;
    const workers = req.body.workers;

    let location = await Location.findById(locationId);

    if (location === null) {
      return res.json({
        isSuccess: false,
        data: "Location não existe",
      });
    }

    let company = await Companie.findById(companyId);

    if (company === null) {
      return res.json({
        isSuccess: false,
        data: "Company não existe",
      });
    }

    const office = {
      locationId: locationId,
      companyId: companyId,
      workers: workers,
    };

    await Office.findOneAndUpdate(
      { locationId: locationId, companyId: companyId },
      {
        $set: office,
      },
      {
        //Caso não exista insere novo
        upsert: true,
        new: true,
        runValidators: true,
      }
    )
      .then((result) => {
        // console.log(result);
        res.json({ isSuccess: true, data: result });
      })
      .catch((error) => {
        let data = error.message;
        res.json({ isSuccess: false, data });
      });
  }
);

router.put(
  "/addWorker",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;
    const {
      totalyearlycompensation,
      monthlysalary,
      yearsofexperience,
      yearsatcompany,
      tag,
    } = req.body;

    if (tag !== "") {
      let tags = await Tag.findById(tag);

      if (tags === null) {
        return res.json({
          isSuccess: false,
          data: "Tag não existe",
        });
      }
    }

    const worker = {
      totalyearlycompensation: totalyearlycompensation || null,
      monthlysalary: monthlysalary || null,
      yearsofexperience: yearsofexperience || null,
      yearsatcompany: yearsatcompany || null,
      tag_id: tag || null,
    };

    //se enviar o worker a null enviar erro
    if (
      !totalyearlycompensation &&
      !monthlysalary &&
      !yearsofexperience &&
      !tag
    ) {
      return res.json({
        isSuccess: false,
        data: "Necessita de Adicionar os dados do Worker",
      });
    }

    let office = await Office.findById(id);

    if (office === null) {
      return res.json({
        isSuccess: false,
        data: "Office não encontrado",
      });
    }

    office.workers.push(worker);
    office
      .save()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((error) => {
        let data = error.message;
        res.json({ isSuccess: false, data });
      });
  }
);

router.put(
  "/updateWorker",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const idWorker = req.query.idWorker;
    const idOffice = req.query.idOffice;
    const idTag = req.body.tag;

    if (idTag !== "") {
      let tag = await Tag.findById(idTag);

      if (tag === null) {
        return res.json({
          isSuccess: false,
          data: "Tag não existe",
        });
      }
    }

    const worker = {
      "workers.$.totalyearlycompensation": req.body.totalyearlycompensation,
      "workers.$.monthlysalary": req.body.monthlysalary,
      "workers.$.yearsofexperience": req.body.yearsofexperience,
      "workers.$.yearsatcompany": req.body.yearsatcompany,
      "workers.$.tag_id": idTag,
    };

    await Office.updateOne(
      { _id: idOffice, "workers._id": idWorker },
      {
        $set: worker,
      }
    )
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((error) => {
        let data = error.message;
        res.json({ isSuccess: false, data });
      });
  }
);

router.put(
  "/updateOffice",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    const locationId = req.body.location;
    const companyId = req.body.companie;

    let location = await Location.findById(locationId);

    if (location === null) {
      return res.json({
        isSuccess: false,
        data: "Location não existe",
      });
    }

    let company = await Companie.findById(companyId);

    if (company === null) {
      return res.json({
        isSuccess: false,
        data: "Company não existe",
      });
    }

    const officeUpdated = {
      _id: id,
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
        new: true,
        upsert: true,
        runValidators: true,
      }
    )
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((error) => {
        let data = error.message;
        res.json({ isSuccess: false, data });
      });
  }
);

router.delete(
  "/deleteOffice",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    await Office.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.json({ isSuccess: true, data: "Apagado Com Sucesso" });
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
