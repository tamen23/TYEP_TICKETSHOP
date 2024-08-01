import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-motDePasse');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// Middleware to check for admin or organisator roles
export const adminOrOrganisateur = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'organisateur')) {
    next();
  } else {
    res.status(401).json({ msg: 'Not authorized as admin or organisator' });
  }
};

// Middleware to check for admin role only
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ msg: 'Not authorized as admin' });
  }
};
