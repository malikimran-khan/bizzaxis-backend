const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

console.log("CLOUDINARY:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING",
});

/* ---------------- Cloudinary Config ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------------- Multer + Cloudinary Storage ---------------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "bizzaxis-posts",
      resource_type: "image",
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG images are allowed"), false);
    }
  },
});

/* ---------------- MongoDB Connection ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ---------------- Mongoose Model ---------------- */
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

/* ---------------- Routes ---------------- */

// CREATE POST
app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file?.path;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        message: "Title, description and image are required",
      });
    }

    const post = await Post.create({
      title,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL POSTS
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
