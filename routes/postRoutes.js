const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { upload } = require("../middleware/upload");
const { protect } = require("../middleware/auth");
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/",protect, upload.single("image"), postController.createPost);

router.delete("/:id",protect, postController.deletePost);

module.exports = router;
