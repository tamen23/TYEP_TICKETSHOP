import User from '../models/User.js';
import generateToken from '../utils/jwt.js';

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
