// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'organisateur', 'utilisateur'],
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: function () {
      return this.role === 'admin'; // username is required for admins
    }
  },
  nom: {
    type: String,
    required: function () {
      return this.role !== 'admin'; // nom is required for organisateurs and utilisateurs
    }
  },
  prenom: {
    type: String,
    required: function () {
      return this.role !== 'admin'; // prenom is required for organisateurs and utilisateurs
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  motDePasse: {
    type: String,
    required: true
  },
  nomDeStructure: {
    type: String,
    required: function () {
      return this.role === 'organisateur'; // nomDeStructure is required for organisateurs
    }
  },
  telephone: {
    type: String,
    required: function () {
      return this.role !== 'admin'; // telephone is required for organisateurs and utilisateurs
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Method to match the entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.motDePasse);
};

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;
