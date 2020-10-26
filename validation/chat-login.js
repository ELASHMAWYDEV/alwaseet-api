//This route is for chat users
const db = require("../db");
const bcrypt = require("bcrypt");

module.exports = async ({ username, password }) => {
  try {
    let errors = [];

    //Required
    if (!user) errors.push("يجب كتابة اسم المستخدم أو البريد الالكتروني");
    if (!password) errors.push("يجب كتابة كلمة المرور");

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    //DB Check
    let userSearch = await db("users").findOne({
      $or: [{ email: user }, { username: user }],
    });
    userSearch = userSearch && userSearch.toJSON();

    if (!userSearch) {
      errors.push(
        "اسم المستخدم أو البريد الالكتروني الذي أدخلته غير مسجل من قبل"
      );
    }

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    //Password Match
    if (!(await bcrypt.compare(password, userSearch.password))) {
      errors.push("كلمة المرور التي أدخلتها غير صحيحة");
    }

    //delete the password from user object
    delete userSearch.password;

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      user: userSearch,
    };
  } catch (e) {
    return {
      success: false,
      errors: [e.message],
    };
  }
};
