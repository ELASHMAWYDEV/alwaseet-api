const express = require("express");
const router = express.Router();


//Routes
router.use("/auth", require("./auth/index"));
router.use("/create-chat", require("./create-chat"));

module.exports = router;