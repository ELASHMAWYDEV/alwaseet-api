require("dotenv").config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/alwaseet",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN || "randomaccesstoken",
  
}