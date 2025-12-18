const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- Database Connection ---------------- */
connectDB();

/* ---------------- Routes ---------------- */
app.use("/api/posts", postRoutes);

/* ---------------- Test Route ---------------- */
app.get("/api", (req, res) => {
  res.send("server is working");
});

/* ---------------- Global Error Handler ---------------- */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

/* ---------------- Server ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
