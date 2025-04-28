import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import routes from "./routes/index-route.mjs";

dotenv.config();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL;
const clientUrl = process.env.CLIENT_URL;

mongoose
    .connect(dbUrl)
    .then(() => console.log("connected to db"))
    .catch((err) => console.error(err));

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"]
  }
});

// Правильная настройка CORS
app.use(cors({
  origin: clientUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/api", routes);

// Сокеты
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (chatID) => {
    socket.join(chatID);
    console.log(`Socket ${socket.id} joined room ${chatID}`);
  });

  socket.on("sendMessage", (data) => {
    const { chatID, text, userID } = data;
    console.log(`Message to room ${chatID}:`, text);

    // Отправляем сообщение только участникам комнаты
    io.to(chatID).emit("newMessage", { chatID, text, userID });
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  try {
    console.log(`listening on port ${port}`);
  } catch (err) {
    console.error(err);
  }
});
