const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyRole("any"), async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post(
  "/createTag",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const tag = new Tag({
      tag: req.body.tag,
    });

    try {
      const createdTag = await tag.save();
      res.json(createdTag);
    } catch (err) {
      res.json(err);
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

    Tag.findOneAndUpdate(
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

    Tag.deleteOne({ _id: id })
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
