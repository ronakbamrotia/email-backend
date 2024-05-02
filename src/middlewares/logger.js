const winston = require("winston");
const morgan = require("morgan");
const { combine, timestamp, json } = winston.format;

// We can store all the access, error, info and other types of logs in separate files.
// The below configuration stores all types of logs in a single file called combined.log
const logger = winston.createLogger({
    level: "http",
    defaultMeta: {
        service: "email-service",
    },
    format: combine(
        timestamp(),
        json()
    ),
    transports: [new winston.transports.Console(),
    new winston.transports.File({
        filename: "logs/combined.log",
    })],
});

const morganMiddleware = morgan(
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, "content-length"),
            response_time: Number.parseFloat(tokens["response-time"](req, res)),
        });
    },
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(`incoming-request`, data);
            },
        },
    }
);

module.exports = {
    morganMiddleware,
    logger
};