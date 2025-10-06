import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Example = mongoose.model('Example', exampleSchema);
export default Example;
