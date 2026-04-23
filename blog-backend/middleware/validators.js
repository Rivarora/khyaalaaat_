const { body } = require("express-validator");

exports.registerValidation = [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("username").notEmpty()
];
