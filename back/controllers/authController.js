// back/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this is set in your .env

exports.register = async (req, res) => {
  const { name, phone, email, password, role, profession } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
    }

    if (!role || !['client', 'technicien'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    let professionsToSave = [];
    if (role === 'technicien') {
        if (profession && Array.isArray(profession)) {
            professionsToSave = profession;
        } else if (profession && typeof profession === 'string') {
             professionsToSave = [profession];
        }
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
      profession: professionsToSave, // Save as an array
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

exports.getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('name email phone profession');
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des clients' });
  }
};

// --- NEW FUNCTION: Get all Technicians ---
exports.getAllTechnicians = async (req, res) => {
  console.log('--- getAllTechnicians START ---'); // Debugging log
  try {
    const technicians = await User.find({ role: 'technicien' })
      .select('name email phone profession'); // Select fields relevant to technicians
    console.log(`Technicians found (BACKEND): ${technicians.length} (IDs: ${technicians.map(t => t._id).join(', ')})`); // More detailed log
    res.status(200).json(technicians);
  } catch (error) {
    console.error('Error fetching technicians (BACKEND):', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des techniciens.' });
  } finally {
    console.log('--- getAllTechnicians END ---'); // Debugging log
  }
};


exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expects 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

exports.getTechnicianProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Non authentifié ou données utilisateur manquantes dans le token.' });
  }
  try {
    const technician = await User.findById(req.user.id).select('-password');
    
    if (!technician) {
      return res.status(404).json({ message: 'Technicien non trouvé.' });
    }
    
    if (technician.role !== 'technicien') {
      return res.status(403).json({ message: 'Accès refusé: Votre compte n\'est pas un compte technicien.' });
    }
    
    technician.profession = Array.isArray(technician.profession) ? technician.profession : [];

    res.status(200).json(technician);
  } catch (error) {
    console.error('Error fetching technician profile (BACKEND):', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil.' });
  }
};

exports.updateTechnicianProfile = async (req, res) => {
  const { name, phone, email, profession } = req.body;
  const userId = req.user.id;

  try {
    const technician = await User.findById(userId);
    if (!technician) {
      return res.status(404).json({ message: 'Technicien non trouvé.' });
    }
    if (technician.role !== 'technicien') {
      return res.status(403).json({ message: 'Accès refusé: Pas un technicien.' });
    }

    if (name) technician.name = name;
    if (phone) technician.phone = phone;
    if (email && email !== technician.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && String(existingUser._id) !== String(userId)) {
        return res.status(400).json({ message: 'Email déjà utilisé par un autre utilisateur.' });
      }
      technician.email = email;
    }
    if (Array.isArray(profession)) {
        technician.profession = profession;
    } else {
        technician.profession = [];
    }

    await technician.save();
    res.status(200).json({ message: 'Profil mis à jour avec succès', technician });
  } catch (error) {
    console.error('Error updating technician profile (BACKEND):', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.' });
  }
};