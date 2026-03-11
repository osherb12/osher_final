import 'reflect-metadata';
import './config.js'; // validate env vars at startup
import path from 'path';
import fs from 'fs';
import express from 'express';
import { connectDB } from './utils/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Serve static files from the React frontend
const frontendDistPath = path.join(__dirname, '../../react/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  // Fallback for React Router
  app.use((_req, res) => {
    const filePath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Page not found');
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
