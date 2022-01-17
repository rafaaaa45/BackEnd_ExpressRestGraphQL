const express = require("express");
const router = express.Router();
const Office = require("../models/Offices");
const Location = require("../models/Location");
const Companie = require("../models/Companies");
const Tag = require("../models/Tags");
const auth = require("../middleware/auth");
const { count } = require("../models/Tags");

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

    for (const worker of workers) {
      if (worker.tag !== "") {
        const tag = await Tag.findById(worker.tag_id);

        if (tag === null) {
          return res.json({
            isSuccess: false,
            data: "Não existe tag para o UUID " + worker.tag_id,
          });
        }
      } else {
        //se enviar o worker a null enviar erro
        if (
          !worker.totalyearlycompensation &&
          !worker.monthlysalary &&
          !worker.yearsofexperience &&
          !worker.tag_id
        ) {
          return res.json({
            isSuccess: false,
            data: "Necessita de Adicionar os dados do Worker",
          });
        }
      }
    }

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
      .populate("locationId")
      .populate("companyId")
      .populate("workers.tag_id")
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
    const idOffice = req.query.id;
    const data = req.body;

    for (const worker of data) {
      if (worker.tag !== "") {
        const tag = await Tag.findById(worker.tag_id);

        if (tag === null) {
          return res.json({
            isSuccess: false,
            data: "Não existe tag para o UUID " + worker.tag_id,
          });
        }
      } else {
        //se enviar o worker a null enviar erro
        if (
          !worker.totalyearlycompensation &&
          !worker.monthlysalary &&
          !worker.yearsofexperience &&
          !worker.tag_id
        ) {
          return res.json({
            isSuccess: false,
            data: "Necessita de Adicionar os dados do Worker",
          });
        }
      }
    }

    await Office.updateOne(
      { _id: idOffice },
      {
        $push: { workers: data },
      }
    )
      .then((result) => {
        console.log(result);
        if (result.modifiedCount) {
          res.json({ isSuccess: true, data: "Worker(s) inserido(s)!" });
        } else {
          res.json({ isSuccess: false, data: "Não foi encontrado o office!" });
        }
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
    const workers = req.body.workers;

    for (const worker of workers) {
      if (worker.tag !== "") {
        const tag = await Tag.findById(worker.tag_id);

        if (tag === null) {
          return res.json({
            isSuccess: false,
            data: "Não existe tag para o UUID " + worker.tag_id,
          });
        }
      } else {
        //se enviar o worker a null enviar erro
        if (
          !worker.totalyearlycompensation &&
          !worker.monthlysalary &&
          !worker.yearsofexperience &&
          !worker.tag_id
        ) {
          return res.json({
            isSuccess: false,
            data: "Necessita de Adicionar os dados do Worker",
          });
        }
      }
    }

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
      locationId: locationId,
      companyId: companyId,
    };

    let officeVerificacao = await Office.find(officeUpdated);
    //verificação se já existe algum office com a localização e company inseridas
    if (officeVerificacao && officeVerificacao[0]._id !== id) {
      return res.json({
        isSuccess: false,
        data:
          "Não pode atualizar o office com o UUID " +
          id +
          " para um office já existente!",
      });
    }

    await Office.findOneAndUpdate(
      { _id: id },
      {
        $set: officeUpdated,
        $push: { workers: workers },
      },
      {
        //Caso não exista id insere novo
        new: true,
        upsert: true,
        runValidators: true,
      }
    )
      .populate("locationId")
      .populate("companyId")
      .populate("workers.tag_id")
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

router.get("/GetMedia", async (req, res) => {
  let officesMediaSalary = [];
  let companiesMediaSalary = [];
  let Offices = await Office.find()
    .populate("locationId")
    .populate("companyId")
    .populate("workers.tag_id");

  Promise.all(
    Offices.map((office) => {
      let somaSalario = 0;
      let totalWorkers = office.workers.length;
      for (const worker of office.workers) {
        somaSalario = somaSalario + worker.monthlysalary;
      }

      let media = somaSalario / totalWorkers;

      const ObjectOffice = {
        empresa: office.companyId.companie,
        mediaSalario: media.toFixed(0),
        totalWorkers: office.workers.length,
      };

      officesMediaSalary.push(ObjectOffice);
    })
  ).then(async () => {
    for (const office of officesMediaSalary) {
      let currentOffice;
      currentOffice = office;
      empresaName = office.empresa;
      let somaSalario = 0;
      let totalWorkers = 0;

      if (empresaName === "facebook") {
        console.log(companiesMediaSalary.includes(empresaName));
      }
      for (const officeMedia of officesMediaSalary) {
        if (currentOffice.empresa === officeMedia.empresa) {
          if (isNaN(officeMedia.mediaSalario)) {
            somaSalario = somaSalario + 0;
          } else {
            somaSalario = somaSalario + parseInt(officeMedia.mediaSalario);
            totalWorkers = totalWorkers + officeMedia.totalWorkers;
          }
        }
      }

      companiesMediaSalary = companiesMediaSalary.filter(
        (e) => e.empresa !== empresaName
      );

      let media = somaSalario / totalWorkers;

      const ObjectEmpresa = {
        empresa: empresaName,
        mediaSalario: media.toFixed(2),
        totalFuncionarios: totalWorkers,
      };

      await companiesMediaSalary.push(ObjectEmpresa);
    }

    res.json({ data: companiesMediaSalary });
  });
});

module.exports = router;
