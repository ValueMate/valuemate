const express = require("express");
const port = 8000;
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const mysql = require("mysql");
const config = require("./config");

// Create MySQL connection
var connection = mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.log("Couldn't connect to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as connection ID: " + connection.threadId);
});

// Start Next.js server
nextApp.prepare().then(() => {
  const app = express();

  // Serve Next.js app
  app.get("*", (req, res) => {
    return handle(req, res);
  });

  // Start Express server
  app.listen(port, function () {
    console.log(`Server is running at http://localhost:${port}`);
  });
});

// Handle SIGINT signal to properly close MySQL connection
process.on("SIGINT", () => {
  console.log("Closing database connection...");
  connection.end((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(); // Exit the process after closing the connection
  });
});
