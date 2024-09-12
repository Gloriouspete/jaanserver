const theroom = "jaanroom";

function Chat(socket, io) {
  console.log("a user connected");
  console.log("A user connected", socket.id);
  socket.on("user-id", (userId) => {
    console.log("i don receive userid o ", userId);
    socket.join(userId);
  });

  socket.on("joinchat", () => {
    console.log("connected");
    socket.join(theroom);  
  });

  socket.on("message", (data) => {
    console.log("This is the Message received:", data);
    socket.join(theroom);
    io.to(theroom).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
}

module.exports = Chat;
