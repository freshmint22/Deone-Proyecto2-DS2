import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().limit(10);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
