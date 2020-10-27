const express = require("express");
const router = express.Router();


//Routes
router.use("/auth", require("./auth/index"));
router.use("/create-chat", require("./create-chat"));
router.use("/get-chats", require("./get-chats"));
router.use("/finish-chat", require("./finish-chat"));

module.exports = router;