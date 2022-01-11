const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");
const Office = require("../models/Offices");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyAny, async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Tag.findById(id)
      .then((result) => {
        if (result !== null) {
          res.json({ isSuccess: true, data: result });
        } else {
          res.json({ isSuccess: false, data: "Tag não encontrada" });
        }
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  } else {
    await Tag.find()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
});

router.post(
  "/createTag",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const tag = {
      tag: req.body.tag,
    };

    await Tag.findOneAndUpdate(
      { tag: req.body.tag },
      {
        $set: tag,
      },

      {
        //Caso não exista insere novo
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

router.put(
  "/updateTag",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;
    const newTagName = req.body.tag;

    const TagUpdate = {
      _id: id,
      tag: newTagName,
    };

    await Tag.findOneAndUpdate(
      { _id: id },
      {
        $set: TagUpdate,
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
  "/deleteTag",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    let worker = await Office.find({ "workers.tag_id": id });
    if (worker.length > 0) {
      return res.json({
        isSuccess: false,
        data: "Não pode apagar esta tag pois tem worker(s) associado(s).",
      });
    }

    await Tag.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.json({ isSuccess: true, data: "Apagado Com Sucesso" });
        } else {
          res.json({ isSuccess: false, data: "Tag não existe" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

module.exports = router;
