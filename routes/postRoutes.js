const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { upload } = require("../middleware/upload");

router.post("/", upload.single("image"), postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.delete("/:id", postController.deletePost);

module.exports = router;
