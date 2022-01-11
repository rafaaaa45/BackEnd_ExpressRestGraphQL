const express = require("express");
const router = express.Router();
const Companie = require("../models/Companies");
const Office = require("../models/Offices");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyAny, async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Companie.findById(id)
      .then((result) => {
        if (result !== null) {
          res.json({ isSuccess: true, data: result });
        } else {
          res.json({ isSuccess: false, data: "Companie não encontrada" });
        }
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  } else {
    await Companie.find()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
});

router.post(
  "/createCompanie",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const companie = {
      companie: req.body.companie,
    };

    await Companie.findOneAndUpdate(
      { companie: req.body.companie },
      {
        $set: companie,
      },
      {
        //Caso não exista insere novo
        upsert: true,
        runValidators: true,
        new: true,
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
  "/updateCompanie",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    const companieUpdated = {
      _id: id,
      companie: req.body.companie,
    };

    await Companie.findOneAndUpdate(
      { _id: id },
      {
        $set: companieUpdated,
      },
      {
        //Caso não exista id insere
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
  "/deleteCompanie",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    let office = await Office.find({ companyId: id });
    if (office.length > 0) {
      return res.json({
        isSuccess: false,
        data: "Não pode apagar esta company pois tem office(s) associado(s).",
      });
    }

    await Companie.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.json({ isSuccess: true, data: "Apagado Com Sucesso" });
        } else {
          res.json({ isSuccess: false, data: "Companie não existe" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

module.exports = router;
