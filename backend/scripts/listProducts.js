#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';

dotenv.config({ path: process.env.DOTENV_PATH || path.resolve(process.cwd(), '.env') });
const MONGO = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/deone';

async function main(){
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  try{
    const products = await Product.find({}).limit(50).lean();
    console.log(`Found ${products.length} products (showing up to 50):`);
    for(const p of products){
      const name = p.nombre || p.name || '<unnamed>';
      const categoria = p.categoria || p.category || '<none>';
      const imagen = p.imagen;
      let imgInfo = '<none>';
      if(imagen){
        const isDataUrl = typeof imagen === 'string' && imagen.startsWith('data:');
        const len = imagen.length;
        imgInfo = `${isDataUrl ? 'data:' : 'url:'}len=${len}`;
      }
      console.log(`${p._id} | ${name} | categoria:${categoria} | imagen:${imgInfo}`);
    }
  }catch(err){
    console.error(err);
  }finally{
    try{ await mongoose.disconnect(); }catch(e){}
  }
}

main();
