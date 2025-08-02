const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'technicien',
  },
  profession: { type: String, required: true },  // <-- add this field
}); // Do NOT include password here or handle carefully if you want to exclude it from responses

module.exports = mongoose.model('Technician', technicianSchema);
