const express = require("express");
const router = express.Router();
const validation = require("../../validation/login");
const db = require("../../db");
const { createToken, checkToken } = require("../../helpers/jwt");

router.post("/", checkToken, async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        success: true,
        accessToken: await createToken(req.user),
        messages: ["لقد قمت بتسجيل الدخول بالفعل"],
      });
    }
    

    //Validation
    const validateUser = await validation(req.body);
    if (!validateUser.success) {
      return res.json(validateUser);
    }


    //Create the accessToken
    const accessToken = await createToken({ _id: validateUser.user._id });

    //Send the jwt token with the success response
    return res.json({
      success: true,
      messages: ["تم تسجيل الدخول بنجاح"],
      user: validateUser.user,
      accessToken,
    });
  } catch (e) {
    res.json({
      success: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
