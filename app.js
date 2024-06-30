import express, { urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import newsRoute from "./routes/news.route.js";
import bookRoute from "./routes/book.route.js";
import questionRoute from "./routes/question.route.js";
import quizRoute from "./routes/quiz.route.js";
import scoreRoute from "./routes/score.route.js";
import globalErrorHandler from "./controllers/error.controller.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "192.168.1.65:3000",
      "*",
      "https://quizu-backend-1.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/score", scoreRoute);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
