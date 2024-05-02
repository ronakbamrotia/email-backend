const express = require("express");
const { Queue } = require("bullmq");
const validateRequest = require("../validations/sendEmailNotificationValidation");
const redisIoConnection = require("../config/redisIoConnection");
const emailNotificationModel = require("../models/emailNotification");

// Loading email templates from json file this can be stored in database for production applications
const templates = require("../emailTemplates/templates.json");
const { logger } = require("../middlewares/logger");

const router = express.Router();

router.post(
    "/api/send-email-notification",
    validateRequest,
    async (req, res) => {
        // Replacing all the dynamic template parameters with their respective values
        let expiryTemplate = templates["cloud-trial-expiry-template"];
        expiryTemplate = expiryTemplate.replaceAll("{{name}}", req.body.body_data.name);
        expiryTemplate = expiryTemplate.replaceAll("{{days}}", req.body.body_data.days);
        expiryTemplate = expiryTemplate.replaceAll("{{label}}", req.body.body_data.link.label);
        expiryTemplate = expiryTemplate.replaceAll("{{url}}", req.body.body_data.link.url);

        const requestBody = {
            key: req.body.key,
            subject: req.body.subject,
            delayed_send: req.body.delayed_send || null,
            body_data: {
                name: req.body.body_data.name,
                days: req.body.body_data.days,
                link: {
                    label: req.body.body_data.link.label,
                    url: req.body.body_data.link.url,
                },
            },
            email: req.body.email,
            bcc: req.body.bcc,
            body: expiryTemplate
        }

        try {
            // Saving the record in database
            const response = await emailNotificationModel.create(requestBody);

            let delay = 0;
            if (req.body.delayed_send) {
                delay = Date.parse(new Date(req.body.delayed_send).toUTCString()) - Date.parse(new Date().toUTCString());
                // If backdated datetime is passed send the email immediately without any delay
                if (delay <= 0) {
                    delay = 0
                }
            }

            const queueBody = {
                uuid: response.uuid,
                email: req.body.email,
                bcc: req.body.bcc,
                subject: req.body.subject,
                body: expiryTemplate
            }

            // Creating / Fetching a queue for email notifications
            const myQueue = new Queue("email-notification", {
                connection: redisIoConnection
            });
            // Adding the email notification job with necessary parameters in the queue
            await myQueue.add("email-notification", queueBody, { delay });

            // Assuming that the email with 0 delay will be instantly delivered we send 200 else 202 for delayed notification
            if (delay === 0) {
                return res.status(200).json({ "message": "Email delivered" })
            }
            return res.status(202).json({ "message": "Email queued for delivery at specified date and time" });
        } catch (e) {
            logger.error("incoming-request-error", { url: "/api/send-email-notification", error: e.message });
            return res.status(500).json({ "message": "Error in email delivery" });
        }
    }
);

module.exports = router;