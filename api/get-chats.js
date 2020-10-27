const express = require("express");
const router = express.Router();
const db = require("../db");
const mongoose = require("mongoose");
const { checkToken } = require("../helpers/jwt");

router.post("/", checkToken, async (req, res) => {
  try {
    //Check if user is logged in
    if (!req.user) {
      return res.json({
        success: false,
        errors: ["يجب عليك تسجيل الدخول أولا لكي تتمكن من عرض المحادثات"],
      });
    }

    let chats = await db("chats").find({
      userId: mongoose.Types.ObjectId(req.user._id),
    }).lean();

    if (chats.length == 0) {
      return res.json({
        success: false,
        errors: ["لم تقم بإنشاء محادثات من قبل"],
      });
    }

    //Set active or not
    chats.forEach(chat => {
      chat.active = chat.endTime > Date.now();

    });
    
    return res.json({
      success: true,
      chats,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      errors: ["لم نتمكن من ايجاد المحادثة"],
    });
  }
});

//get single chat
router.post("/:id", checkToken, async (req, res) => {
  try {
    //Check if user is logged in
    if (!req.user) {
      return res.json({
        success: false,
        errors: ["يجب عليك تسجيل الدخول أولا لكي تتمكن من عرض المحادثات"],
      });
    }

    //If a single chat was requested
    let chat = await db("chats").findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    }).lean();

    if (!chat) {
      return res.json({
        success: false,
        errors: ["لم نتمكن من ايجاد المحادثة"],
      });
    } else {


      //Set active or not
      chat.active = chat.endTime > Date.now();

      return res.json({
        success: true,
        chat,
      });
    }

  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      errors: ["لم نتمكن من ايجاد المحادثة"],
    });
  }
});

module.exports = router;
