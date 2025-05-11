import express from "express";
import cors from "cors";
import main from "./routes/index";

export const app = express();

const allowedOrigins = [
    "http://localhost:3000",
];

app.use(cors());
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