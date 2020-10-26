module.exports = async ({ title, userOne, userTwo, endTime }) => {
  try {
    let errors = [];

    //Required
    if (!title) errors.push("يجب كتابة عنوان المحادثة");
    if (!userOne) errors.push("يجب كتابة اسم المستخدم الأول");
    if (!userTwo) errors.push("يجب كتابة اسم المستخدم الثاني");
    if (!endTime) errors.push("يجب تحديد مدة المحادثة");

    if (errors.length != 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      chat: {
        title,
        userOne,
        userTwo,
        endTime
      }
    };
  } catch (e) {
    return {
      success: false,
      errors: [e.message],
    };
  }
};
