module.exports = io => {
  io.on("connection", socket => {
    console.log("New client connected");

    //Routes
    require("./messages")(io, socket);
  });
}