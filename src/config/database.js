const { Sequelize } = require("sequelize");
const { logger } = require("../middlewares/logger");

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialectOptions: {
        ssl: {
            require: true
        },
    },
    timezone: "utc"
});

(async () => {
    try {
        await sequelize.authenticate();
    } catch (e) {
        // An alert should be triggered here to the team regarding interrupted connection
        await logger.error("connection-error-[database]");
        throw new Error("Unable to connect to the database " + e.message);
    }
})();

module.exports = sequelize;