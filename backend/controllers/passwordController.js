import User from '../models/User.js';
import crypto from 'crypto';

const tokens = new Map(); // in-memory token store: NOT for production

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false });
  const user = await User.findOne({ email }).lean();
  if (!user) return res.status(200).json({ success: true }); // don't reveal
  const token = crypto.randomBytes(20).toString('hex');
  tokens.set(token, { userId: user._id.toString(), expires: Date.now() + 1000 * 60 * 15 });
  // In production: send email with token link
  return res.json({ success: true, token });
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ success: false });
  const data = tokens.get(token);
  if (!data || data.expires < Date.now()) return res.status(400).json({ success: false, message: 'Token inválido' });
  await User.findByIdAndUpdate(data.userId, { password: newPassword });
  tokens.delete(token);
  return res.json({ success: true });
}

export default { forgotPassword, resetPassword };
