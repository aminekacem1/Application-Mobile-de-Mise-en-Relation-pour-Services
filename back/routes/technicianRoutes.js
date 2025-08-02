const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const search = req.query.q || '';

  try {
    const technicians = await User.find({
      role: 'technicien',
      name: { $regex: search, $options: 'i' },
    }).select('name phone email role profession');  // Add profession here

    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching technicians' });
  }
});


module.exports = router;
