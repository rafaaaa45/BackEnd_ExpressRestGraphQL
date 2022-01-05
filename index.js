const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const Tag = require("./models/Tags.js");

//conexão bdd mongodb
require("./middleware/mongoDatabase").connect();

//middleware to parse the body
app.use(bodyParser.json());

//permitir o cors
app.use(cors({ credentials: true, origin: true }));

const { v4: uuidv4 } = require("uuid");
const { UUIDv4 } = require("uuid-v4-validator");

//Tests Endpoint
app.get("/", (req, res) => {
  const newGUID = uuidv4();
  console.log(newGUID);
  console.log(UUIDv4.validate("123"));
  res.send("Hello World!");
});

//-------------------------- TESTES GRAPHQL ----------------

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    _id: { type: GraphQLID },
    tag: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "getTags",
  fields: {
    getAllTags: {
      type: new GraphQLList(TagType),
      resolve(parent, args) {
        return Tag.find().exec();
      },
    },
  },
});

const Mutation = "TesteMutation";

const schema = new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutation,
});

//GraphQl run server
app.use(
  "/api/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

//Import Routes

const utilizadorRoutes = require("./routes/utilizadoresRoutes");
const locationRoutes = require("./routes/locationsRoutes");
const companieRoutes = require("./routes/companiesRoutes");
const tagRoutes = require("./routes/tagsRoutes");
const officeRoutes = require("./routes/officesRoutes");

app.use("/api/utilizador", utilizadorRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/companies", companieRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/tags", tagRoutes);

//Iniciar o Servidor
app.listen(process.env.PORT, () => {
  console.log(`App Ligada em http://localhost:${process.env.PORT}`);
});
