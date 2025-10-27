#!/usr/bin/env node
/**
 * Migration helper: list products without merchantId and optionally assign them to a merchant.
 *
 * Usage:
 *  node scripts/assignProductsToMerchant.js            # list products missing merchantId
 *  node scripts/assignProductsToMerchant.js --category "Cafetería"    # list by category
 *  node scripts/assignProductsToMerchant.js --assign <merchantId> --confirm  # assign all missing to merchantId
 *  node scripts/assignProductsToMerchant.js --assign <merchantId> --category "Cafetería" --confirm
 *
 * Safety: the script requires --confirm to perform updates. Otherwise it only prints a report.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ path: process.env.DOTENV_PATH || path.resolve(process.cwd(), '.env') });

const MONGO = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/deone';

async function main(){
  const args = process.argv.slice(2);
  const assignIndex = args.indexOf('--assign');
  const categoryIndex = args.indexOf('--category');
  const confirm = args.includes('--confirm');
  const auto = args.includes('--auto');
  const assignId = assignIndex !== -1 ? args[assignIndex+1] : null;
  const category = categoryIndex !== -1 ? args[categoryIndex+1] : null;

  console.log('Connecting to', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  try{
    const baseFilter = { $or: [ { merchantId: { $exists: false } }, { merchantId: null } ] };
    const filter = category ? { ...baseFilter, categoria: category } : baseFilter;

    const products = await Product.find(filter).lean();
    if(!products || products.length === 0){
      console.log('No products found matching filter (no products without merchantId).');
      return process.exit(0);
    }

    console.log(`Found ${products.length} products without merchantId${category? ' in category '+category : ''}:`);
    for(const p of products){
      console.log(`${p._id} | ${p.nombre || '<sin nombre>'} | categoria: ${p.categoria || '<sin categoria>'}`);
    }

    if(assignId){
      if(!confirm){
        console.log('\n--assign provided but --confirm missing. This is a dry-run. Re-run with --confirm to perform assignments.');
        return process.exit(0);
      }
      // validate merchant exists and is comercio
      const user = await User.findById(assignId).lean();
      if(!user){
        console.error('No user found with id', assignId);
        return process.exit(2);
      }
      if(user.role !== 'comercio' && user.role !== 'admin'){
        console.error('Target user is not a comercio (role=', user.role, '). Aborting.');
        return process.exit(3);
      }

      const res = await Product.updateMany(filter, { $set: { merchantId: assignId } });
      console.log(`Assigned merchantId=${assignId} to ${res.modifiedCount || res.nModified || res.modified || 0} products.`);
    } else if (auto) {
      // auto-assign: for each category among the matched products, try to find a merchant with that category
      if(!confirm){
        console.log('\n--auto provided but --confirm missing. This is a dry-run. Re-run with --auto --confirm to perform assignments.');
        return process.exit(0);
      }
      // group products by category
      const byCategory = {};
      for(const p of products){
        const cat = (p.categoria || '').trim() || '<sin>'; 
        if(!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(p);
      }

      for(const cat of Object.keys(byCategory)){
        if(cat === '<sin>'){
          console.log(`\nSkipping products without category (count=${byCategory[cat].length}).`);
          continue;
        }
        // find merchants with this category (case-insensitive)
        const merchant = await User.findOne({ role: 'comercio', category: { $regex: new RegExp('^'+cat+'$', 'i') } }).lean();
        if(!merchant){
          console.log(`\nNo merchant found with category='${cat}'. Skipping ${byCategory[cat].length} products.`);
          continue;
        }
        const ids = byCategory[cat].map(p=>p._id);
        const res = await Product.updateMany({ _id: { $in: ids } }, { $set: { merchantId: merchant._id } });
        console.log(`\nAssigned ${res.modifiedCount || res.nModified || res.modified || 0} products in category='${cat}' to merchant ${merchant._id} (${merchant.email || merchant.name || ''}).`);
      }
    } else {
      console.log('\nNo --assign or --auto flag provided: finished report (dry run).');
    }
  }catch(err){
    console.error('Error running script:', err);
    process.exit(1);
  }finally{
    try{ await mongoose.disconnect(); }catch(e){}
  }
}

main();
