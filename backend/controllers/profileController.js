import User from '../models/User.js';

export async function getMe(req, res){
  try{
    const userId = req.user?.id || req.user?._id;
    if(!userId) return res.status(400).json({ success:false, message: 'User id missing' });
    const user = await User.findById(userId).lean();
    if(!user) return res.status(404).json({ success:false, message: 'User not found' });
    // do not send password
    const { password, __v, ...rest } = user;
    return res.json({ success:true, data: rest });
  }catch(err){
    console.error('getMe error', err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
}

import bcrypt from 'bcryptjs';

export async function updateMe(req, res){
  try{
    const userId = req.user?.id || req.user?._id;
    if(!userId) return res.status(400).json({ success:false, message: 'User id missing' });
    const payload = {};
    if(req.body.nombre || req.body.name) payload.name = req.body.nombre || req.body.name;
    if(req.body.phone) payload.phone = req.body.phone;
    if(req.body.direccion) payload.direccion = req.body.direccion;
    if(req.body.avatarUrl) payload.avatarUrl = req.body.avatarUrl;
    if(req.body.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(userId, payload, { new:true }).lean();
    if(!updated) return res.status(404).json({ success:false, message: 'User not found' });
    const { password, __v, ...rest } = updated;
    return res.json({ success:true, data: rest });
  }catch(err){
    console.error('updateMe error', err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
}

export default { getMe, updateMe };
