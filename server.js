const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

io.on("connection", socket => {
  console.log("کاربر وصل شد:", socket.id);

  socket.on("join-room", roomId => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", socket.id);

    socket.on("signal", data => {
      // data = {to, signal}
      io.to(data.to).emit("signal", {from: socket.id, signal: data.signal});
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, ()=>console.log("Server running on port", PORT));
