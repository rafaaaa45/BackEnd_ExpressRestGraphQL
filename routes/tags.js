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

router.get(
  "/updateTag",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    console.log(req.user);
    res.json("hi");
  }
);

module.exports = router;
