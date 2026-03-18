import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { startConsumer } from "./consumer";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: { title: "Notification Service API", version: "1.0.0" },
      },
    })
  )
  .ws("/ws", {
    open(ws) {
      ws.subscribe("notifications");
      console.log("Client connected to WebSocket");
    },
    close(ws) {
      console.log("Client disconnected from WebSocket");
    }
  })
  .get("/health", () => ({ status: "ok", service: "notification-service" }))
  .listen(3003);

startConsumer((eventData: any) => {
  app.server?.publish("notifications", JSON.stringify(eventData));
}).catch(console.error);

console.log(`Notification Service running on port ${app.server?.port}`);
