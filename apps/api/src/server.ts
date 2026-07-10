import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true });

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3020",
  "https://js.newflowsys.cloud",
];
app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("CORS"), false);
  },
});
app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } });

app.get("/health", async () => ({ status: "ok" }));

const port = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
