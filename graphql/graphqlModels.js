const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    _id: { type: GraphQLID },
    tag: { type: GraphQLString },
  }),
});

const LocationType = new GraphQLObjectType({
  name: "Location",
  fields: () => ({
    _id: { type: GraphQLID },
    location: { type: GraphQLString },
  }),
});

const CompanieType = new GraphQLObjectType({
  name: "Companie",
  fields: () => ({
    _id: { type: GraphQLID },
    companie: { type: GraphQLString },
  }),
});

const WorkerType = new GraphQLObjectType({
  name: "Worker",
  fields: () => ({
    _id: { type: GraphQLID },
    totalyearlycompensation: { type: GraphQLInt },
    monthlysalary: { type: GraphQLInt },
    yearsofexperience: { type: GraphQLInt },
    yearsatcompany: { type: GraphQLInt },
    tag: { type: TagType },
  }),
});

const OfficeType = new GraphQLObjectType({
  name: "Office",
  fields: () => ({
    _id: { type: GraphQLID },
    locationId: { type: LocationType },
    companyId: { type: CompanieType },
    workers: { type: new GraphQLList(WorkerType) },
  }),
});

exports.TagType = TagType;
exports.OfficeType = OfficeType;
