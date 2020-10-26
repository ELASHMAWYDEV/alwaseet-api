//This route is for mediators
const db = require("../db");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

module.exports = async ({
  name,
  username,
  email,
  password,
  passwordConfirm,
}) => {
  try {
    let errors = [];

    //Required
    if (!name) errors.push("يجب كتابة الاسم");
    if (!username) errors.push("يجب كتابة اسم المستخدم");
    if (!email) errors.push("يجب كتابة البريد الالكتروني");
    if (!password) errors.push("يجب كتابة كلمة المرور");
    if (!passwordConfirm) errors.push("يجب كتابة تأكيد كلمة المرور");

    //Unique
    if (await db("users").findOne({ email }))
      errors.push("هذا البريد الالكتروني مسجل من قبل");
    if (await db("users").findOne({ username }))
      errors.push("اسم المستخدم مسجل من قبل");

    //Password
    if (password != passwordConfirm)
      errors.push("يجب أن تكون كلمة المرور وتأكيد كلمة المرور متطابقان");
    if (password.length < 6)
      errors.push("يجب أن تحتوي كلمة المرور علي 6 أحرف علي الأقل");

    //Email
    if (!emailValidator.validate(email))
      errors.push("هذا البريد الالكتروني غير صالح");

    if (errors.length == 0) {

      //hash password
      password = await bcrypt.hash(password, 10);

      const user = {
        name,
        username,
        email,
        password,
      };

      return {
        success: true,
        user,
      };
    } else {
      return {
        success: false,
        errors,
      };
    }
  } catch (e) {
    return {
      success: false,
      errors: [e.message],
    };
  }
};
