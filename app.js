require("dotenv").config(); // Load env variables

const express = require("express");
const connectDB = require("./server/db");

const app = express(); // Express application

async function establishConnection() {
  await connectDB(); // Connection to database
}

establishConnection();

const protected = require("./middleware/index");

const userRoutes = require("./routes/userRoutes");
const projectContainerRoutes = require("./routes/projectContainerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const activityRoutes = require("./routes/activityRoutes");
const itemRoutes = require("./routes/itemRoutes");
const projectReleaseRoutes = require("./routes/projectReleaseRoutes");
const activityReleaseRoutes = require("./routes/activityReleaseRoutes");
const billRoutes = require("./routes/billRoutes");

app.use(express.json()); // Parse incoming request bodies

// Log incoming req details
app.use((req, res, next) => {
  console.log("Incoming request:");
  console.log("Req:", req.method);
  console.log("Path:", req.path);
  next();
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/projectContainer", protected, projectContainerRoutes);
app.use("/api/v1/project", protected, projectRoutes);
app.use("/api/v1/activity", protected, activityRoutes);
app.use("/api/v1/item", protected, itemRoutes);
app.use("/api/v1/projectRelease", protected, projectReleaseRoutes);
app.use("/api/v1/activityRelease", protected, activityReleaseRoutes);
app.use("/api/v1/bill", protected, billRoutes);

const PORT = process.env.PORT || 8000; // Port number
app.listen(PORT, () => {
  console.log(`Server is now listening on port http://localhost:${PORT}`);
});

// Event listener for uncaught exception
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
});

// Event listener for unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
