import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { connectDB } from "./config/db.js";

import authRouter from "./routers/authRoute.js";
import meRouter from "./routers/meRoute.js";
import noteRouter from "./routers/noteRoute.js";
import { requireAuth } from "./middlewares/auth.js";

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://notes-profile.s3.ap-southeast-2.amazonaws.com", // your bucket
          "https://*.s3.ap-southeast-2.amazonaws.com", // regional buckets (optional)
          // "https://*.s3.amazonaws.com",                           // global pattern (optional)
          // "https://cdn.yourdomain.com",                           // if you front with CloudFront
        ],
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
  })
);

import { fileURLToPath } from "url";
import { dirname } from "path";

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/me", requireAuth, meRouter);
app.use("/api/v1/note", requireAuth, noteRouter);

// app.use("/{*any}", (req, res) => {
//   return res.status(404).json({ message: "Not Found" });
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// to redirect frontend
app.use(express.static(path.join(__dirname, "/notes-web/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/notes-web/dist/index.html"));
});

app.use((err, req, res, next) => {
  const errStatus = err.statusCode ?? 500;
  const errMessage = err.message ?? "Internal server error";
  return res.status(errStatus).json({ message: errMessage });
});

import path from "path";
app.use("/static", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`API is running on PORT ${PORT}`));
  } catch (err) {
    console.log(`API error: ... ${err}`);
    exit(1);
  }
})();
