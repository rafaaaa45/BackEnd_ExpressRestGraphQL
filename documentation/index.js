const express = require("express");
const app = express();
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

swaggerDocument.host = `${process.env.HOST}:${process.env.PORT}`;

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.SWAGGER_PORT, () => {
  console.log(
    `swagger server is listening on port ${process.env.SWAGGER_PORT}`
  );
});
