import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true });

app.register(cors, { origin: "http://localhost:3000" });
app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

app.get("/health", async () => ({ status: "ok" }));

const start = async () => {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
