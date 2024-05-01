const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Defining the database table schema 
const emailNotification = sequelize.define("email_notification", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    key: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    delayed_send: {
        type: DataTypes.DATE,
        allowNull: true
    },
    body_data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    email: {
        type: DataTypes.JSON,
        allowNull: false
    },
    bcc: {
        type: DataTypes.JSON,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: "Pending"
    }
}, {
    tableName: "email_notification",
    createdAt: "created_at",
    updatedAt: "updated_at"
});

(async () => {
    await emailNotification.sync({ force: false });
})();

module.exports = emailNotification