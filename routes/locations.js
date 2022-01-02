const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.get("/", auth.verifyToken, auth.verifyRole("any"), async (req, res) => {
  const id = req.query.id;

  if (id) {
    await Location.findOne({ id })
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "ID não encontrado" });
      });
  } else {
    await Location.find()
      .then((result) => {
        res.json({ isSuccess: true, data: result });
      })
      .catch((err) => {
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
});

router.post("/createLocation", async (req, res) => {
  const location = new Location({
    location: req.body.location,
  });

  try {
    const createdLocation = await location.save();
    res.json(createdLocation);
  } catch (err) {
    res.json(err);
  }
});

router.put(
  "/updateLocation",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    const locationUpdated = {
      location: req.body.location,
    };

    Location.findOneAndUpdate(
      { _id: id },
      {
        $set: locationUpdated,
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
  "/deleteLocation",
  auth.verifyToken,
  auth.verifyRole(["admin", "edit"]),
  async (req, res) => {
    const id = req.query.id;

    Location.deleteOne({ _id: id })
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
