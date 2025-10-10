import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  // ...implementation to create user, hash password, return token
  res.status(501).json({ message: 'Not implemented' });
};

export const login = async (req, res) => {
  // ...implementation to verify user and return JWT
  res.status(501).json({ message: 'Not implemented' });
};
