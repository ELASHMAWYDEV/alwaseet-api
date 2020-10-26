const express = require("express");
const router = express.Router();
const db = require("../db");
const { checkToken } = require("../helpers/jwt");

router.post("/", checkToken, (req, res) => {
  //Check if user is logged in
  if (!req.user) {
    return res.json({
      success: false,
      errors: ["يجب عليك تسجيل الدخول أولا لكي تتمكن من انشاء محادثة جديدة"]
    })
  };

  


});

module.exports = router;