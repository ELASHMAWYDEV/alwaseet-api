//This route is for chat users
const db = require("../db");
const bcrypt = require("bcrypt");

module.exports = async ({ chatNumber, password }) => {
  try {
    let errors = [];

    //Required
    if (!chatNumber) errors.push("يجب كتابة رقم المحادثة");
    if (!password) errors.push("يجب كتابة كلمة المرور");

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    //DB Check
    let userSearch = await db("chats").findOne({ chatNumber });
    userSearch = userSearch && userSearch.toJSON();

    if (!userSearch) {
      errors.push(
        "لا توجد محادثة بهذا الرقم ، يرجي التأكد من رقم المحادثة مرة أخري"
      );
    }

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    //Password Match
    let userOne = await bcrypt.compare(password, userSearch.userOnePassword);
    let userTwo = await bcrypt.compare(password, userSearch.userTwoPassword);

    if (!(userOne || userTwo)) {
      errors.push("كلمة المرور التي أدخلتها غير صحيحة");
    }

    //delete the password from user object
    delete userSearch.userOnePassword;
    delete userSearch.userTwoPassword;

    //Change the object structure, to hanlde it properly in front-end
    if (userOne) {
      userSearch.username = userSearch.userOne;
      userSearch.toUsername = userSearch.userTwo;
    }
    
    if (userTwo) {
      userSearch.username = userSearch.userTwo;
      userSearch.toUsername = userSearch.userOne;
    }

    //Delete unused properties
    delete userSearch.userOne;
    delete userSearch.userTwo;

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      chatUser: userSearch,
    };
  } catch (e) {
    return {
      success: false,
      errors: [e.message],
    };
  }
};
