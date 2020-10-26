const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const db = require("./db");

//Socket Handler
require("./socket/index")(io);

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//Api
app.use("/api", require("./api/index"));


http.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
