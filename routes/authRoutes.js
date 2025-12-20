const express = require("express");
const router = express.Router();
const { loginOrSignup } = require("../controllers/authController");

router.post("/login", loginOrSignup);

module.exports = router;
