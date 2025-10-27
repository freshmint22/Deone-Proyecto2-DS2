#!/usr/bin/env node
/**
 * Script: assignImagesToProducts.js
 *
 * Adds a placeholder image (or provided image URL) to products that don't have one yet.
 * Usage:
 *   node scripts/assignImagesToProducts.js                # dry-run, lists products missing imagen
 *   node scripts/assignImagesToProducts.js --all --image "/assets/placeholder-product.png" --confirm
 *   node scripts/assignImagesToProducts.js --image "https://example.com/img.jpg" --confirm
 *
 * Safety: by default the script only reports. Use --confirm to perform updates.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';

dotenv.config({ path: process.env.DOTENV_PATH || path.resolve(process.cwd(), '.env') });

const MONGO = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/deone';

async function main(){
  const args = process.argv.slice(2);
  const confirm = args.includes('--confirm');
  const all = args.includes('--all');
  const imageIndex = args.indexOf('--image');
  const image = imageIndex !== -1 ? args[imageIndex+1] : '/assets/placeholder-product.png';

  console.log('Connecting to', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  try{
    const baseFilter = all ? {} : { $or: [ { imagen: { $exists: false } }, { imagen: null }, { imagen: '' } ] };
    const products = await Product.find(baseFilter).lean();
    if(!products || products.length === 0){
      console.log('No products found matching filter.');
      return process.exit(0);
    }

    console.log(`Found ${products.length} products${all? '' : ' without imagen'}:`);
    for(const p of products){
      console.log(`${p._id} | ${p.nombre || '<sin nombre>'} | categoria: ${p.categoria || '<sin categoria>'} | imagen: ${p.imagen || '<none>'}`);
    }

    if(!confirm){
      console.log('\nDry run: no changes performed. Re-run with --confirm to apply the image updates.');
      return process.exit(0);
    }

    const res = await Product.updateMany(baseFilter, { $set: { imagen: image } });
    console.log(`\nUpdated ${res.modifiedCount || res.nModified || res.modified || 0} products with imagen='${image}'.`);
  }catch(err){
    console.error('Error running script:', err);
    process.exit(1);
  }finally{
    try{ await mongoose.disconnect(); }catch(e){}
  }
}

main();
