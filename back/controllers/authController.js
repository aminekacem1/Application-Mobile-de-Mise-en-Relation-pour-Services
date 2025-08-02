const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (req, res) => {
  const { name, phone, email, password, role, profession } = req.body; // add profession here

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
    }

    if (!role || !['client', 'technicien'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    // Add profession validation if role is technicien
    if (role === 'technicien' && (!profession || profession.trim() === '')) {
      return res.status(400).json({ message: 'La profession est obligatoire pour un technicien.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      profession: role === 'technicien' ? profession : undefined, // save profession only if technician
    });

    await newUser.save();

    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir email et mot de passe' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Mot de passe non défini, contactez l\'administrateur' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};
