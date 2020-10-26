const express = require("express");
const router = express.Router();
const validation = require("../validation/create-chat");
const db = require("../db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { checkToken } = require("../helpers/jwt");

router.post("/", checkToken, async (req, res) => {
  try {
    //Check if user is logged in
    if (!req.user) {
      return res.json({
        success: false,
        errors: ["يجب عليك تسجيل الدخول أولا لكي تتمكن من انشاء محادثة جديدة"],
      });
    }


    let validateChat = await validation(req.body);
    if (!validateChat.success) {
      return res.json(validateChat);
    }

    //create a random chatNumber & userOnePassword & userTwoPassword
    //ChatNumber based on last 8 digits of Date.now()
    let chatNumber = Date.now().toString().slice(-8);
    let userOnePassword = Math.floor(Math.random() * 1000000000).toString();
    let userTwoPassword = Math.floor(Math.random() * 1000000000).toString();

    //Encrypt passwords
    let hashedUserOnePassword = await bcrypt.hash(userOnePassword, 10);
    let hashedUserTwoPassword = await bcrypt.hash(userTwoPassword, 10);

    //Create the chat Object
    let chat = {
      ...validateChat.chat,
      chatNumber,
      userOnePassword: hashedUserOnePassword,
      userTwoPassword: hashedUserTwoPassword,
      userId: mongoose.Types.ObjectId(req.user._id),
    };


    //Save to DB
    let saveChat = await db("chats").create(chat);
    if (!saveChat) {
      return res.json({
        success: false,
        errors: ["حدث خطأ ما ، يرجي المحاولة مرة اخري"]
      });
    }


    return res.json({
      success: true,
      messages: ["تم انشاء محادثة جديدة بنجاح"],
      chat: {
        chatNumber,
        title: saveChat.title,
        userOne: saveChat.userOne,
        userTwo: saveChat.userTwo,
        userOnePassword,
        userTwoPassword,
      }
    })

  } catch (e) {
    res.json({
      success: false,
      errors: [e.message],
    });
  }
});

module.exports = router;
