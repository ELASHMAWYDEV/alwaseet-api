const express = require("express");
const router = express.Router();


//Routes
router.use("/register", require("./register"));
router.use("/login", require("./login"));
router.use("/chat-login", require("./chat-login"));

module.exports = router;