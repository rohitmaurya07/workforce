import { Server } from "socket.io";
import Message from "../models/Message.Model.js";

let io;

export default function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-project", (projectId) => {
      if (!projectId) return;
      socket.join(projectId);
      console.log(`${socket.id} joined ${projectId}`);
    });

    socket.on("leave-project", (projectId) => {
      if (!projectId) return;
      socket.leave(projectId);
      console.log(`${socket.id} left ${projectId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { projectId, sender, text } = data || {};

        if (!projectId || !sender || !text?.trim()) {
          socket.emit("message-error", { message: "Missing projectId, sender, or text" });
          return;
        }

        let message = await Message.create({
          project: projectId,
          sender,
          text: text.trim(),
        });

        message = await Message.findById(message._id).populate(
          "sender",
          "name avatar email"
        );

        io.to(projectId).emit("receive-message", message);
      } catch (err) {
        console.error("send-message error:", err);
        socket.emit("message-error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
}

// Safer accessor — throws clearly instead of silently returning undefined
// if something tries to use io before setupSocket() has run.
export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call setupSocket(server) first.");
  }
  return io;
}

export { io };