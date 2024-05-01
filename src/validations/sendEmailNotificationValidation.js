const { validationResult, body } = require("express-validator");

const validateRequest = [
    body("key")
        .exists().withMessage("Email template is required").bail()
        .isString().withMessage("Email template should be a string").bail()
        .notEmpty().escape().withMessage("Email template cannot be empty"),
    body("subject")
        .exists().withMessage("Subject is required").bail()
        .notEmpty().escape().isString().withMessage("Subject cannot be empty"),
    body("delayed_send")
        .optional({ nullable: true })
        .isISO8601().withMessage("Provide valid date value"),
    body("body_data.name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name should be a string").bail()
        .notEmpty().escape().withMessage("Name cannot be empty"),
    body("body_data.days")
        .exists().withMessage("Days is required").bail()
        .isNumeric().withMessage("Days should be a number").bail()
        .notEmpty().escape().withMessage("Days cannot be empty"),
    body("body_data.link.label")
        .exists().withMessage("Link label is required").bail()
        .isString().withMessage("Link label should be a string").bail()
        .notEmpty().escape().withMessage("Link label cannot be empty"),
    body("body_data.link.url")
        .exists().withMessage("Link URL is required").bail()
        .isString().withMessage("Link URL should be a string").bail()
        .notEmpty().withMessage("Link URL cannot be empty")
        .isURL().escape().withMessage("Not a valid URL"),
    body("email")
        .isArray({ min: 1 }).withMessage("Atleast one email is required"),
    body("email.*")
        .not().isArray().isEmail().withMessage("Invalid email value"),
    body("bcc")
        .isArray({ min: 1 }).withMessage("Atleast one email is required"),
    body("bcc.*")
        .not().isArray().isEmail().withMessage("Invalid email value"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateRequest;