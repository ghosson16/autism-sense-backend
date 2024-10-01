require('dotenv').config();
const express = require('express');
const crypto = require('crypto');  // Ensure crypto is imported
const connectDB = require('./config/db.cjs');
const sessionMiddleware = require('./middleware/sessionMiddleware.cjs');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes.cjs');
const childRoutes = require('./routes/childRoutes.cjs');
const emotionDetectionRoutes = require('./routes/emotionDetectionRoutes.cjs');
const zoomRoutes = require('./routes/zoomRoutes.cjs'); // Include your zoom routes

const app = express();
const port = process.env.PORT || 5001;

// Middleware
// Apply CORS to all routes
app.use(cors());

// Helmet for basic security headers
app.use(helmet());

// Add specific headers required for Zoom Video SDK
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json());
app.use(sessionMiddleware);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/child', childRoutes);
app.use('/api', emotionDetectionRoutes);
app.use('/api/zoom', zoomRoutes);  // Make sure to add Zoom routes here

// Add the `/user` route to check the user session
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
