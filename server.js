// server.js
// Express backend for portfolio contact form

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// --- START: Updated CORS Configuration ---

// Define allowed origins for CORS
// It will use your live frontend URL from Render's environment variables
// and fall back to your local development URL if it's not set.
const allowedOrigins = [
  process.env.CORS_ORIGIN, 
  'http://127.0.0.1:5500'
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow if the origin is in our list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Handle preflight requests for all routes
app.options('*', cors()); 

// --- END: Updated CORS Configuration ---


app.use(express.json());

// POST /api/contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Create transporter using SMTP (Gmail example)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // App password or email password
    }
  });

  // Email options
  const mailOptions = {
    from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO, // Your receiving email
    subject: `New message from ${name} via Portfolio Contact Form`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
