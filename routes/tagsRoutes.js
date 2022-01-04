const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyAny, async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Tag.findOne({ id })
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "ID não encontrado" });
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
        upsert: true,
        runValidators: true,
      }
    )
      .then((result) => {
        if (result) {
          res.json({ isSuccess: false, data: result });
        } else {
          res.json({ isSuccess: true, data: "Nova Tag criada" });
        }
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
        upsert: true,
        runValidators: true,
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

    await Tag.deleteOne({ _id: id })
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
