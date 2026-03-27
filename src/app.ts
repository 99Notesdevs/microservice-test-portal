import express from "express";
import cors from "cors";
import main from "./routes/index";
import { logRequest } from "./middlewares/logsMiddleware";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({
    origin: [
      "https://99notes.org",
      "http://99notes.org",
      "http://test.99notes.org",
      "https://test.99notes.org",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-type"],
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequest);

app.use("/api/v1", main);
