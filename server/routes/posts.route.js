const express = require('express');
// Extract files
const multer = require('multer');
// Ramda library
const R = require('ramda');

const PostsController = require('../controllers/posts.controller');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'server/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}_${Date.now()}.${ext}`);
  },
});

// Create
router.post('',
  checkAuth,
  multer({
    storage,
  }).single('image'), PostsController.createPost);

// Update
router.put('/:id', checkAuth, multer({
    storage
  }).single('image'),
  PostsController.updatePost);

router.delete('/:id', checkAuth,
  PostsController.deletePost);

// Get all posts
router.get('',
  PostsController.getAllPosts);

// Get post predicate id post
router.get('/:id',
  PostsController.getPostById);

module.exports = router;
