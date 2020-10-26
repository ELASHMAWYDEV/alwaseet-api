const mongoose = require("mongoose");
const { MONGODB_URI } = require("./settings/config");

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", () => console.error("MongoDb Error !"));
db.once("open", () => console.log("MongoDb Connected..."));

const Schema = new mongoose.Schema({}, { strict: false });


module.exports = collection => new mongoose.model(collection, Schema);