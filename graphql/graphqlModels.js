const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

//TYPES DEFAULT BY MONGOOSE MODEL
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
    tag_id: { type: TagType },
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

// SPECIAL TYPES
const Empresa_countWorkersType = new GraphQLObjectType({
  name: "Empresa_countWorkers",
  fields: () => ({
    companie: { type: GraphQLString },
    TotalWorkers: { type: GraphQLInt },
  }),
});

const Workers_EmpresaPorLocationType = new GraphQLObjectType({
  name: "Workers_EmpresaPorLocation",
  fields: () => ({
    location: { type: GraphQLString },
    empresas: {
      type: new GraphQLList(Empresa_countWorkersType),
    },
  }),
});

const mediaSalario = new GraphQLObjectType({
  name: "mediasalarioEmpresa",
  fields: () => ({
    companie: { type: GraphQLString },
    media: { type: GraphQLString },
    workers: { type: GraphQLInt },
  }),
});
exports.Workers_EmpresaPorLocationType = Workers_EmpresaPorLocationType;
exports.OfficeType = OfficeType;
exports.mediaSalario = mediaSalario;
