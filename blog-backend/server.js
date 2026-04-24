const app = require("./app");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
