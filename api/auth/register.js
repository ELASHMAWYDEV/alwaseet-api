const express = require("express");
const router = express.Router();
const validation = require("../../validation/register");
const db = require("../../db");
const { createToken } = require("../../helpers/jwt");

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const validateUser = await validation(user);
    if (!validateUser.success) {
      return res.json(validateUser);
    }

    //Save the user in DB
    const saveUser = await db("users").create(validateUser.user);
    if (!saveUser) {
      return res.json({
        success: false,
        errors: ["حدث خطأ غير متوقع ، يرجي المحاولة فيما بعد"],
      });
    }

    //Send the jwt token with the success response
    const accessToken = await createToken({ _id: saveUser._id });
    return res.json({
      success: true,
      messages: ["تم التسجيل بنجاح"],
      accessToken
    });
  } catch (e) {
    res.json({
      success: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
