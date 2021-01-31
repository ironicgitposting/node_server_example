const Post = require('../models/post.model');

// Create Posts
exports.createPost = (req, res, next) => {
  const imagePath = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath,
    author: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post added succesfully.',
      post: {
        ...createdPost,
        id: createdPost._id,
      },
    });
  });
};

// Update Posts
exports.updatePost = (req, res, next) => {
  let {
    imagePath,
  } = req.body;
  if (req.file) {
    imagePath = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  const post = {
    title: req.body.title,
    content: req.body.content,
    imagePath,
  };
  console.log(req.userData.userId);
  Post.updateOne({
    _id: req.params.id,
    author: req.userData.userId,
  }, post).then((result) => {
    console.log(result);
    if (result.nModified > 0) {
      res.json({
        message: 'Update succesful.',
      });
    } else {
      console.log('nope');
    }
  });
};

// Delete Post
exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
  }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted!',
    });
  }).catch((err) => {
    console.log(err);
  });
};

// Get all Posts
exports.getAllPosts = (req, res, next) => {
  const {
    pageSize,
    page,
  } = req.query;

  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && page) {
    postQuery
      .skip(pageSize * (page - 1))
      .limit(parseInt(pageSize, 10));
  }
  postQuery
    .then((posts) => {
      fetchedPosts = posts;
      return Post.count();
    }).then((count) => {
      res.status(200).json({
        totalPosts: count,
        posts: fetchedPosts,
      });
    })
    .catch((error) => {

    });
};

// Get one post
exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!',
      });
    }
  });
};
