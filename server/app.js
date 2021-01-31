const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const corsMiddleware = require('./middleware/cors');
const postsRoutes = require('./routes/posts.route');
const userRoutes = require('./routes/user.route');

const app = express();

// Connect DB
mongoose.connect('mongodb://root:toor@localhost:27017/course?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Probably do migrations etc there
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to MongoDB database failded');
  });

// Middlewares
app.use(corsMiddleware({
  allowedMethods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// Authorize static folder for /images route
// Request to /images are now forwarded to /server/images
app.use('/images', express.static(path.join('server/images')));

// Launch Jobs

// Activated routes
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
