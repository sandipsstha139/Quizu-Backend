import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./database/database.js";

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed !!!", err);
  });
