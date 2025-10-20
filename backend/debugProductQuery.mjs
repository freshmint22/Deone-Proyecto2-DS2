import dotenv from 'dotenv'; dotenv.config();
import mongoose from 'mongoose';
import Product from './models/Product.js';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/deone';
(async ()=>{
  try{
    await mongoose.connect(uri);
    const products = await Product.find({}).lean();
    console.log('products length', products.length);
    console.log(products);
    await mongoose.disconnect();
  }catch(e){
    console.error('error', e);
  }
})();
