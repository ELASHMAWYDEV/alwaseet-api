const jwt = require("jsonwebtoken");
const db = require("../db");
const { ACCESS_TOKEN } = require("../settings/config");

module.exports = {
  createToken: async (payload) => {
    try {
      const token = await jwt.sign(payload, ACCESS_TOKEN);
      return token;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  checkToken: async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      if (!token) {
        req.user = null;
        return next();
      }

      const user = await jwt.verify(token, ACCESS_TOKEN);

      //check DB existence
      const searchUser = await db("users").findOne({ _id: user._id });
      if (searchUser) {
        req.user = searchUser;
        return next();
      } else {
        req.user = null;
        return next();
      }
    } catch (e) {
      console.log(e);
      return next();
    }
  },
  checkChatUser: async (req, res, next) => {
    try {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      if (!token) {
        req.chatUser = null;
        return next();
      }

      const chatUser = await jwt.verify(token, ACCESS_TOKEN);

      //check DB existence
      const searchUser = await db("chats").findOne({
        $or: [{ userOneId: chatUser._id }, { userTwoId: chatUser._id }],
      });

      if (searchUser) {
        req.chatUser = searchUser;
        return next();
      } else {
        req.chatUser = null;
        return next();
      }
    } catch (e) {
      console.log(e);
      return next();
    }
  },
};
