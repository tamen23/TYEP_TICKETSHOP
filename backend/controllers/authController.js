import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Register a new user
export const registerUser = async (req, res) => {
  const { role, username, nom, prenom, email, motDePasse, nomDeStructure, telephone } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      role,
      username,
      nom,
      prenom,
      email,
      motDePasse,
      nomDeStructure,
      telephone,
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      role: user.role,
      username: user.username,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      nomDeStructure: user.nomDeStructure,
      telephone: user.telephone,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Authenticate user & get token
export const authUser = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(motDePasse);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      role: user.role,
      username: user.username,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      nomDeStructure: user.nomDeStructure,
      telephone: user.telephone,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { role, username, nom, prenom, email, motDePasse, nomDeStructure, telephone } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role || user.role;
    user.username = username || user.username;
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    if (motDePasse) {
      const salt = await bcrypt.genSalt(10);
      user.motDePasse = await bcrypt.hash(motDePasse, salt);
    }
    user.nomDeStructure = nomDeStructure || user.nomDeStructure;
    user.telephone = telephone || user.telephone;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Initiate password reset
export const initiatePasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    // return the token in the response
    res.json({ resetToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reset password using the token received in the response from initiatePasswordReset
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.motDePasse = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
