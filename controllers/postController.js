const Post = require("../models/Post");
const { cloudinary } = require("../middleware/upload");

// CREATE POST
exports.createPost = async (req, res) => {
  // console.log(req.body)
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
};

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET POST BY ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("FETCH POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Extract public ID from Cloudinary URL
    const publicIdMatch = post.image.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png)$/i);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
