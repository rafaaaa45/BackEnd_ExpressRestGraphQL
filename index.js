const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./middleware/auth");
const utils = require("./utils/utils");

//conexão bdd mongodb
require("./middleware/mongoDatabase").connect();

//middleware to parse the body
app.use(bodyParser.json());

//permitir o cors
app.use(cors({ credentials: true, origin: true }));

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
