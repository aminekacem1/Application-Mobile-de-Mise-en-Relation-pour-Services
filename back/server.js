const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth

// --- ADDED THIS SECTION ---
const technicianRoutes = require('./routes/technicianRoutes'); // Import the technician routes
app.use('/api/technicians', technicianRoutes); // Mount technician routes under /api/technicians
// --- END ADDED SECTION ---

// Generic error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all for 404 Not Found - this should be the LAST route handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});