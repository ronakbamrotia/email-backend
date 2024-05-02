const express = require("express");
const emailNotificationModel = require("../models/emailNotification");
const { logger } = require("../middlewares/logger");

const router = express.Router();

router.get(
    "/api/email-notification-list",
    async (req, res) => {
        try {
            const response = await emailNotificationModel.findAll({
                attributes: ["id", "uuid", "key", "subject", "delayed_send", "email", "bcc", "status"],
                order: [["id", "desc"]]
            });

            return res.status(200).json({ "message": "Email notification list", "data": response });
        } catch (e) {
            logger.error("incoming-request-error", { url: "/api/email-notification-list", error: e.message });
            return res.status(400).json({ "message": "Error fetching data" });
        }
    }
);

module.exports = router;