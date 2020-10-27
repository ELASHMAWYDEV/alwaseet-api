const express = require("express");
const router = express.Router();
const db = require("../db");
const mongoose = require("mongoose");
const { checkToken } = require("../helpers/jwt");

router.post("/:id", checkToken, async (req, res) => {
  try {
    //Check if user is logged in
    if (!req.user) {
      return res.json({
        success: false,
        errors: ["يجب عليك تسجيل الدخول أولا لكي تتمكن من عرض المحادثات"],
      });
    }

    if (!req.params.id) {
      return res.json({
        success: false,
        errors: ["حدث خطأ ما ، يرجي المحاولة لاحقا"],
      });
    }

    let updateChat = await db("chats")
      .findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          userId: mongoose.Types.ObjectId(req.user._id),
        },
        {
          endTime: Date.now(),
        }
      )
      .lean();

    //If chat doesn't exist in DB
    if (!updateChat) {
      return res.json({
        success: false,
        errors: ["ليس لديك صلاحية التعديل علي هذه المحادثة"],
      });
    }

    return res.json({
      success: true,
      updateChat,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      errors: ["لم نتمكن من ايجاد المحادثة"],
    });
  }
});

module.exports = router;
