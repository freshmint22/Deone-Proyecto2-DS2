import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, role, studentCode, dob } = req.body;

    // allow either combined name or first+last
    const fullName = name || [firstName || '', lastName || ''].filter(Boolean).join(' ').trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'name (or firstName+lastName), email and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Correo inválido' });
    }

    const domain = (email.split('@')[1] || '').toLowerCase();
    if (domain !== 'correounivalle.edu.co') {
      return res.status(400).json({ message: 'Se requiere correo institucional @correounivalle.edu.co' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

  const userData = { name: fullName, email, password: hashed, role };
  if (studentCode) userData.studentCode = String(studentCode);
  if (dob) userData.dob = new Date(dob);

  const user = new User(userData);
    await user.save();

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
