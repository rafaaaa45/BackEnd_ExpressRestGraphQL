const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} = require("graphql");
const Tag = require("../models/Tags.js");
const Office = require("../models/Offices.js");

const GraphQLModels = require("./graphqlModels");

const queryResolver = new GraphQLObjectType({
  name: "Query",
  description: "Listagem de todas as queries",
  fields: {
    getOfficesEmpresa: {
      type: new GraphQLList(GraphQLModels.OfficeType),
      description: "Get de offices de uma determinada empresa",
      args: {
        idCompanie: { type: GraphQLID },
      },
      resolve: (root, args, context, info) => {
        //procurar offices com determinado id
        const { idCompanie } = args;

        return Office.find({ companyId: idCompanie })
          .populate("locationId")
          .populate("companyId")
          .populate("workers.tag_id")
          .exec();
      },
    },
    countWorkers_EmpresaByLocation: {
      type: GraphQLModels.Workers_EmpresaPorLocationType,
      description:
        "Get de Todas as empresas( e o count de funcionarios naquela location) de determinada location",
      args: {
        idLocation: { type: GraphQLID },
      },
      resolve: async (root, args, context, info) => {
        //procurar offices com determinado id
        const { idLocation } = args;

        const finalData = { location: "", empresas: [] };
        let companies = await Office.find({ locationId: idLocation })
          .populate("locationId")
          .populate("companyId")
          .populate("workers.tag_id");

        for (const companie of companies) {
          finalData.location = companie.locationId.location;
          const ObjectFinal = {
            companie: companie.companyId.companie,
            TotalWorkers: companie.workers.length,
          };

          finalData.empresas.push(ObjectFinal);
        }

        return finalData;
      },
    },
    getWorkersFiltered: {
      type: new GraphQLList(GraphQLModels.OfficeType),
      // age: { $gt: 17 },
      description:
        "Get pessoas de x empresa que tenham > x anos de experiência e que recebam > de x",
      args: {
        idCompanie: { type: GraphQLID },
        salarioSuperior: { type: GraphQLInt },
        anosExperiencia: { type: GraphQLInt },
      },
      resolve: (root, args, context, info) => {
        //procurar offices com determinado id
        const { idCompanie, salarioSuperior, anosExperiencia } = args;

        return Office.find({
          companyId: idCompanie,
          "workers.yearsatcompany": {
            $gt: anosExperiencia,
          },
          "workers.monthlysalary": {
            $gt: salarioSuperior,
          },
        })
          .populate("locationId")
          .populate("companyId")
          .populate("workers.tag_id")
          .exec();
      },
    },
    getEmpresasMedia: {
      type: new GraphQLList(GraphQLModels.mediaSalario),
      description: "Get da média de salário por Office",
      resolve: async (root, args, context, info) => {
        let officesMediaSalary = [];
        let companiesMediaSalary = [];
        let Offices = await Office.find()
          .populate("locationId")
          .populate("companyId")
          .populate("workers.tag_id");

        for (const singleOffice of Offices) {
          let somaSalario = 0;
          let totalWorkers = singleOffice.workers.length;
          for (const worker of singleOffice.workers) {
            somaSalario = somaSalario + worker.monthlysalary;
          }

          let media = somaSalario / totalWorkers;

          const ObjectOffice = {
            companie: singleOffice.companyId.companie,
            media: media.toFixed(0),
            workers: singleOffice.workers.length,
          };

          officesMediaSalary.push(ObjectOffice);
        }
        return officesMediaSalary;
      },
    },
  },
});

module.exports = queryResolver;
