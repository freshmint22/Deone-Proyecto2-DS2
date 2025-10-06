import Example from '../models/Example.js';

export const getExamples = async (req, res) => {
  try {
    const items = await Example.find().limit(10);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
