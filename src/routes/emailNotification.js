const express = require("express");
const emailNotificationModel = require("../models/emailNotification");
const { logger } = require("../middlewares/logger");

const router = express.Router();

router.get(
    "/api/email-notification/:uuid",
    async (req, res) => {
        try {
            const response = await emailNotificationModel.findOne({
                where: {
                    uuid: req.params.uuid
                }
            });

            return res.status(200).json({ "message": "Email notification", "data": response });
        } catch (e) {
            logger.error("incoming-request-error", { url: "/api/email-notification/:uuid", error: e.message });
            return res.status(400).json({ "message": "Error fetching data" });
        }
    }
);

module.exports = router;