#!/usr/bin/env node
/**
 * Database sync + seed script
 * Run with: node src/scripts/setup.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product, Basket, BasketItem, SubscriptionPlan } = require('../models');

const seed = async () => {
  try {
    console.log('🔄 Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // ─── Admin user ──────────────────────────────────────
    const [admin] = await User.findOrCreate({
      where: { mobile: '9999999999' },
      defaults: {
        name: 'Palvii Admin',
        email: 'admin@palvii.in',
        mobile: '9999999999',
        whatsapp: '9999999999',
        password_hash: await bcrypt.hash('Admin@123', 12),
        role: 'ADMIN',
        is_active: true,
      },
    });
    console.log('✅ Admin user:', admin.email, '| Password: Admin@123');

    // ─── Categories ──────────────────────────────────────
    const cats = await Promise.all([
      Category.findOrCreate({ where: { slug: 'daily-essentials' }, defaults: { name: 'Daily Essentials', slug: 'daily-essentials', description: 'Everyday vegetables for every kitchen', sort_order: 1 } }),
      Category.findOrCreate({ where: { slug: 'root-vegetables' }, defaults: { name: 'Root Vegetables', slug: 'root-vegetables', description: 'Fresh roots from farm', sort_order: 2 } }),
      Category.findOrCreate({ where: { slug: 'green-vegetables' }, defaults: { name: 'Green Vegetables', slug: 'green-vegetables', description: 'Fresh green vegetables', sort_order: 3 } }),
      Category.findOrCreate({ where: { slug: 'leafy-vegetables' }, defaults: { name: 'Leafy Vegetables', slug: 'leafy-vegetables', description: 'Fresh leafy greens', sort_order: 4 } }),
      Category.findOrCreate({ where: { slug: 'seasonal-vegetables' }, defaults: { name: 'Seasonal Vegetables', slug: 'seasonal-vegetables', description: 'Best vegetables of the season', sort_order: 5 } }),
    ]);
    const [daily, root, green, leafy, seasonal] = cats.map(([c]) => c);
    console.log('✅ Categories seeded');

    // ─── Products ────────────────────────────────────────
    const products = [
      { category_id: daily.id, name: 'Tomato', slug: 'tomato', short_description: 'Fresh farm tomatoes', unit: 'kg', price: 40, min_quantity: 0.5, stock: 50, is_featured: true },
      { category_id: daily.id, name: 'Onion', slug: 'onion', short_description: 'Fresh farm onions', unit: 'kg', price: 35, min_quantity: 0.5, stock: 80, is_featured: true },
      { category_id: daily.id, name: 'Capsicum', slug: 'capsicum', short_description: 'Crispy fresh capsicum', unit: 'kg', price: 60, min_quantity: 0.25, stock: 20 },
      { category_id: root.id, name: 'Potato', slug: 'potato', short_description: 'Fresh potatoes directly from farm', unit: 'kg', price: 30, min_quantity: 0.5, stock: 100, is_featured: true },
      { category_id: root.id, name: 'Carrot', slug: 'carrot', short_description: 'Sweet fresh carrots', unit: 'kg', price: 50, min_quantity: 0.25, stock: 30 },
      { category_id: green.id, name: 'Cucumber', slug: 'cucumber', short_description: 'Fresh farm cucumbers', unit: 'kg', price: 30, min_quantity: 0.5, stock: 25 },
      { category_id: green.id, name: 'Beans', slug: 'beans', short_description: 'Tender farm beans', unit: 'kg', price: 60, min_quantity: 0.25, stock: 15 },
      { category_id: green.id, name: 'Brinjal', slug: 'brinjal', short_description: 'Fresh farm brinjal', unit: 'kg', price: 40, min_quantity: 0.5, stock: 20 },
      { category_id: green.id, name: 'Cabbage', slug: 'cabbage', short_description: 'Fresh round cabbage', unit: 'piece', price: 35, min_quantity: 1, stock: 20 },
      { category_id: green.id, name: 'Cauliflower', slug: 'cauliflower', short_description: 'Farm fresh cauliflower', unit: 'piece', price: 40, min_quantity: 1, stock: 15, is_seasonal: true },
      { category_id: leafy.id, name: 'Spinach', slug: 'spinach', short_description: 'Fresh farm spinach', unit: 'bunch', price: 15, min_quantity: 1, stock: 30, is_featured: true },
      { category_id: leafy.id, name: 'Coriander', slug: 'coriander', short_description: 'Fresh aromatic coriander', unit: 'bunch', price: 10, min_quantity: 1, stock: 40 },
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { slug: p.slug }, defaults: { ...p, is_active: true } });
    }
    console.log('✅ Products seeded');

    // ─── Trial Basket ─────────────────────────────────────
    const [trialBasket] = await Basket.findOrCreate({
      where: { slug: 'palvii-trial-basket' },
      defaults: {
        name: 'Palvii Trial Basket',
        slug: 'palvii-trial-basket',
        description: 'Your first Palvii experience — a curated selection of farm-fresh vegetables.',
        price: 0,
        approx_weight: '2-3 kg',
        is_trial: true,
        is_active: true,
        sort_order: 1,
      },
    });

    const [smallBasket] = await Basket.findOrCreate({
      where: { slug: 'palvii-small-basket' },
      defaults: {
        name: 'Palvii Small Basket',
        slug: 'palvii-small-basket',
        description: 'Perfect for 1-2 people. Freshly packed weekly essentials.',
        price: 149,
        approx_weight: '2-3 kg',
        is_trial: false,
        is_active: true,
        sort_order: 2,
      },
    });

    const [familyBasket] = await Basket.findOrCreate({
      where: { slug: 'palvii-family-basket' },
      defaults: {
        name: 'Palvii Family Basket',
        slug: 'palvii-family-basket',
        description: 'Ideal for a family of 3-4. A balanced mix of daily essentials.',
        price: 249,
        approx_weight: '4-5 kg',
        is_trial: false,
        is_active: true,
        sort_order: 3,
      },
    });

    const [largeBasket] = await Basket.findOrCreate({
      where: { slug: 'palvii-large-family-basket' },
      defaults: {
        name: 'Palvii Large Family Basket',
        slug: 'palvii-large-family-basket',
        description: 'For large families or weekly stocking. Generous portions of fresh vegetables.',
        price: 399,
        approx_weight: '7-8 kg',
        is_trial: false,
        is_active: true,
        sort_order: 4,
      },
    });
    console.log('✅ Baskets seeded');

    // ─── Subscription Plans ───────────────────────────────
    const plans = [
      { basket_id: smallBasket.id, name: 'Weekly Small Basket', slug: 'weekly-small', frequency: 'WEEKLY', price: 149, description: 'Small basket delivered every week', sort_order: 1 },
      { basket_id: familyBasket.id, name: 'Weekly Family Basket', slug: 'weekly-family', frequency: 'WEEKLY', price: 249, description: 'Family basket delivered every week', sort_order: 2 },
      { basket_id: largeBasket.id, name: 'Weekly Large Basket', slug: 'weekly-large', frequency: 'WEEKLY', price: 399, description: 'Large family basket delivered every week', sort_order: 3 },
      { basket_id: familyBasket.id, name: 'Monthly Family Plan', slug: 'monthly-family', frequency: 'MONTHLY', price: 899, description: 'Family basket 4 deliveries per month', discount_percent: 10, sort_order: 4 },
    ];

    for (const plan of plans) {
      await SubscriptionPlan.findOrCreate({
        where: { slug: plan.slug },
        defaults: { ...plan, is_active: true },
      });
    }
    console.log('✅ Subscription plans seeded');

    console.log('\n🎉 Setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin login:');
    console.log('  Mobile/Email: 9999999999 or admin@palvii.in');
    console.log('  Password:     Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
};

seed();
