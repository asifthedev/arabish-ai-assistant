import express, { type ErrorRequestHandler } from "express";
import { fileURLToPath } from "node:url";
import { chatRouter } from "./routes/chat.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// read JSON from the request body
app.use(express.json());

// simple check to see if the server is up
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/chat", chatRouter);

// serve the React build (made by `npm run build`)
const publicFolder = fileURLToPath(new URL("../public", import.meta.url));
app.use(express.static(publicFolder));

// if anything throws, log it and send a friendly message instead
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
};

app.use(errorHandler);

// Vercel runs the app itself, so we only listen when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Vercel needs the app as the default export
export default app;
