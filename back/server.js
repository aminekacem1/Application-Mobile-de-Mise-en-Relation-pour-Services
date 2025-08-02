const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const technicianRoutes = require('./routes/technicianRoutes');



dotenv.config();

const app = express();

app.use(cors()); // Enables CORS - allows any origin by default
app.use(express.json());

// Import your routes (make sure routes exist and are correct)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/technicians', technicianRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
