import express from "express";
import cors from "cors";
import main from "./routes/index";

export const app = express();

app.use(cors({
    origin: ['http://localhost:3000', "http://localhost:5173", "http://localhost:38893", "http://13.126.229.93:5173", "http://13.126.229.93"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// app.use(cors({
//     origin: function (origin, callback) {
//         if(!origin || !allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     maxAge: 86400,
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", main);
