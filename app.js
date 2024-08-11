import express, { urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import userRoute from "./routes/user.route.js";
import newsRoute from "./routes/news.route.js";
import bookRoute from "./routes/book.route.js";
import questionRoute from "./routes/question.route.js";
import quizRoute from "./routes/quiz.route.js";
import scoreRoute from "./routes/score.route.js";
import categoryRoute from "./routes/category.route.js";
import globalErrorHandler from "./controllers/error.controller.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(helmet());

// Define rate limiter
const limiter = rateLimit({
  max: 15,
  windowMs: 60 * 1000,
  statusCode: 429,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      status: 429,
      message:
        "Too many requests from this IP, please try again after 1 minute!",
    });
  },
});

app.use("/api", limiter);

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "name",
      "email",
      "password",
      "passwordConfirm",
      "role",
      "photo",
      "phone",
      "address",
    ],
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/score", scoreRoute);
app.use("/api/v1/category", categoryRoute);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
