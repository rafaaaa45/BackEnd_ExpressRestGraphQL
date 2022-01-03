const express = require("express");
const router = express.Router();
const Companie = require("../models/Companies");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyRole("any"), async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Companie.findOne({ id })
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "ID não encontrado" });
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
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    try {
      const company = await utils.getCompanie(req.body.companie);
      res.json({ isSuccess: true, data: company });
    } catch (err) {
      console.log(err);
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    }
  }
);

router.put(
  "/updateCompanie",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const companieUpdated = {
      companie: req.body.companie,
    };

    await Companie.findOneAndUpdate(
      { _id: id },
      {
        $set: companieUpdated,
      },
      {
        //Caso não exista id insere
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
  "/deleteCompanie",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    await Companie.deleteOne({ _id: id })
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
