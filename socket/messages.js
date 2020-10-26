module.exports = (io, socket) => {
  socket.on("message", (msg) => {
    socket.emit("msg", `message:${msg} received on server`);
  });
}