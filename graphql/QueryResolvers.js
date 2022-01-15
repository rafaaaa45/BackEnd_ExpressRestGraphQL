const { GraphQLObjectType, GraphQLList, GraphQLID } = require("graphql");
const Tag = require("../models/Tags.js");
const Office = require("../models/Offices.js");

const GraphQLModels = require("./graphqlModels");

const queryResolver = new GraphQLObjectType({
  name: "Query",
  description: "Listagem de todas as queries",
  fields: {
    getAllTags: {
      type: new GraphQLList(GraphQLModels.TagType),
      description: "Retorna a lista de todas as tags",
      resolve: (root, args, context, info) => {
        return Tag.find().exec();
      },
    },
    getOfficesEmpresa: {
      type: new GraphQLList(GraphQLModels.OfficeType),
      description: "Get de offices de uma determinada empresa",
      args: {
        idCompanie: { type: GraphQLID },
      },
      resolve: (root, args, context, info) => {
        //procurar offices com determinado id

        // Office.find()
        // .populate("locationId")
        // .populate("companyId")
        // .populate("workers.tag_id")

        Office.find({}).exec();
        return;
      },
    },
  },
});

module.exports = queryResolver;
