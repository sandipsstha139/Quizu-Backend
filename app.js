import express, { urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import newsRoute from "./routes/news.route.js";
import bookRoute from "./routes/book.route.js";
import globalErrorHandler from "./controllers/error.controller.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: ["localhost:3000"], credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/book", bookRoute);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
