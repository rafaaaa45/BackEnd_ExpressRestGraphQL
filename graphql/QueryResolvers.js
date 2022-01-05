const { GraphQLObjectType, GraphQLList } = require("graphql");
const Tag = require("../models/Tags.js");
const GraphQLModels = require("./graphqlModels");

const queryResolver = new GraphQLObjectType({
  name: "getTags",
  fields: {
    getAllTags: {
      type: new GraphQLList(GraphQLModels.TagType),
      resolve(parent, args) {
        return Tag.find().exec();
      },
    },
  },
});

module.exports = queryResolver;
