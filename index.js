// Express is used to handle all the http routes
const express = require("express");
const cors = require("cors");

// Used to catch async errors to prevent app crashes
require("express-async-errors");

// dotenv module loads all values from the .env file and makes them avialable in process.env object globally
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors(['http://localhost:3000']));

// Connect to the database or else stop the further execution if connection is not made
require("./src/config/database");

// Moragan middleware to log all the incoming http requests
const { morganMiddleware, logger } = require("./src/middlewares/logger");
app.use(morganMiddleware);

// Including all the routes available in this service
const allRoutes = require("./src/routes");
app.use(allRoutes);

// Global error handler to catch any uncaught errors
app.use((err, req, res, next) => {
    logger.error(err.message)
});

// Listening on the mentioned port indefinitely
app.listen(process.env.PORT, () => {
    logger.info(`service-started`);
    console.log(`Email backend service api listening on port ${process.env.PORT}`);
});