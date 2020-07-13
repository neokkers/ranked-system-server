const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewareFolder/error");
const connectDB = require("./config/db");

// load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDB();

// Route files
const auth = require("./routes/auth");
const werewolf = require("./routes/werewolf");
const sh = require("./routes/sh");
const users = require("./routes/users");

const app = express();

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middlewareFolder
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/werewolf", werewolf);
app.use("/api/v1/sh", sh);

// Error handler middlewareFolder
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handling unhandled rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server process
  server.close(() => process.exit(1));
});
