const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyRole("any"), async (req, res) => {
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
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    try {
      const tag = await utils.getTag(req.body.tag);
      res.json({ isSuccess: true, data: tag });
    } catch (err) {
      console.log(err);
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    }
  }
);

router.put(
  "/updateTag",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const tagUpdated = {
      tag: req.body.tag,
    };

    await Tag.findOneAndUpdate(
      { _id: id },
      {
        $set: tagUpdated,
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
  "/deleteTag",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
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
