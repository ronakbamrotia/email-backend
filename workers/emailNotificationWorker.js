// dotenv module loads all values from the .env file and makes them avialable in process.env object globally
require("dotenv").config({ path: "../.env" });

const { Worker } = require("bullmq");
const redisIoConnection = require("../src/config/redisIoConnection");

const emailNotificationModel = require("../src/models/emailNotification");
const sendEmail = require("../src/helpers/email");

// Worker function to process the emails in the queue
const worker = new Worker("email-notification", async job => {
    try {
        // Actual email sending code can be called here with the required parameters from job.data object
        await sendEmail({
            email: job.data.email,
            bcc: job.data.bcc,
            subject: job.data.subject,
            body: job.data.body
        })
    } catch (e) {
        throw new Error(e.message)
    }
}, { connection: redisIoConnection });

// Listner for completed jobs
worker.on("completed", async (job) => {
    // Update status of the email notification on success
    await emailNotificationModel.update({ status: "Sent" }, {
        where: {
            uuid: job.data.uuid
        }
    })
});

// Listner for failed jobs
worker.on("failed", async (job, err) => {
    // Update status of the email notification on failure
    await emailNotificationModel.update({ status: "Failed" }, {
        where: {
            uuid: job.data.uuid
        }
    })
});