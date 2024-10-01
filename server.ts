import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import https from "https";
import fs from "fs";
import { connectDB } from "./src/config/db";
import routes from "./src/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

// const options = {
//     key: fs.readFileSync("./cert/localhost+2-key.pem"),
//     cert: fs.readFileSync("./cert/localhost+2.pem"),
// };

const port = process.env.PORT;

const app = express();

app.use(apiLimiter);
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
    if (req.user) return res.json({ hello: req.user });
    return res.json({ message: "hello world" });
});

// https.createServer(options, app).listen(port, async () => {
//     await connectDB();
//     console.log(`[server]: Server is running at https://localhost:${port}`);
// });

app.listen(port, async() => {
    await connectDB();
    console.log(`[server]: Server is running at https://localhost:${port}`);
})