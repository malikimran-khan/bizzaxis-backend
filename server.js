const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json()); // parse JSON body
console.log("server is working");
const MONGO_URI =
  "mongodb+srv://malikimranawan801_db_user:bcMrhiPiUxGELOe5@cluster0.6qwy8m0.mongodb.net/simpledb?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

// -----------------------
// APIs
// -----------------------

// Create post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const post = new Post({ title, description });
    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
app.get("/api", (req, res) => {
  res.send("Server is working");
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// -----------------------
// Server Listen
// -----------------------
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
