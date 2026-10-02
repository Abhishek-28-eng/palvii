// All Sequelize models in one place
const { sequelize, Sequelize } = require('../config/database');
const { DataTypes } = Sequelize;

// ─── User ─────────────────────────────────────────────
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: true, unique: true },
  mobile: { type: DataTypes.STRING(15), allowNull: false, unique: true },
  whatsapp: { type: DataTypes.STRING(15), allowNull: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('CUSTOMER', 'ADMIN', 'DELIVERY_PARTNER'), defaultValue: 'CUSTOMER' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  profile_image: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'users' });

// ─── Address ──────────────────────────────────────────
const Address = sequelize.define('Address', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  label: { type: DataTypes.STRING(50), defaultValue: 'Home' },
  address_line1: { type: DataTypes.STRING(255), allowNull: false },
  address_line2: { type: DataTypes.STRING(255), allowNull: true },
  area: { type: DataTypes.STRING(100), allowNull: true },
  society: { type: DataTypes.STRING(100), allowNull: true },
  city: { type: DataTypes.STRING(100), defaultValue: 'Pune' },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'addresses' });

// ─── Category ─────────────────────────────────────────
const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'categories' });

// ─── Product ──────────────────────────────────────────
const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  category_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  short_description: { type: DataTypes.STRING(255), allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  unit: { type: DataTypes.STRING(20), defaultValue: 'kg' }, // kg, gm, piece, bunch
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  original_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  min_quantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.5 },
  stock: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_seasonal: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'products' });

// ─── Basket ───────────────────────────────────────────
const Basket = sequelize.define('Basket', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  approx_weight: { type: DataTypes.STRING(50), allowNull: true },
  is_trial: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'baskets' });

// ─── BasketItem ───────────────────────────────────────
const BasketItem = sequelize.define('BasketItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  basket_id: { type: DataTypes.UUID, allowNull: false },
  product_id: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.5 },
  unit: { type: DataTypes.STRING(20), defaultValue: 'kg' },
  note: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: 'basket_items' });

// ─── TrialRequest ─────────────────────────────────────
const TrialRequest = sequelize.define('TrialRequest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: true }, // can be submitted without account
  name: { type: DataTypes.STRING(100), allowNull: false },
  mobile: { type: DataTypes.STRING(15), allowNull: false },
  whatsapp: { type: DataTypes.STRING(15), allowNull: true },
  email: { type: DataTypes.STRING(150), allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: false },
  area: { type: DataTypes.STRING(100), allowNull: true },
  society: { type: DataTypes.STRING(100), allowNull: true },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  family_size: { type: DataTypes.STRING(20), allowNull: true },
  preferred_delivery_day: { type: DataTypes.STRING(20), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'SCHEDULED', 'DELIVERED', 'FEEDBACK_RECEIVED', 'CONVERTED', 'NOT_CONVERTED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  admin_notes: { type: DataTypes.TEXT, allowNull: true },
  scheduled_date: { type: DataTypes.DATEONLY, allowNull: true },
}, { tableName: 'trial_requests' });

// ─── Order ────────────────────────────────────────────
const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  order_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  address_id: { type: DataTypes.UUID, allowNull: true },
  delivery_address: { type: DataTypes.JSON, allowNull: true }, // snapshot of address
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PACKING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'),
    defaultValue: 'PENDING',
  },
  payment_method: { type: DataTypes.ENUM('CASH', 'UPI', 'ONLINE'), defaultValue: 'CASH' },
  payment_status: { type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'), defaultValue: 'PENDING' },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  delivery_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  preferred_delivery_date: { type: DataTypes.DATEONLY, allowNull: true },
  preferred_delivery_time: { type: DataTypes.STRING(50), allowNull: true },
  customer_notes: { type: DataTypes.TEXT, allowNull: true },
  admin_notes: { type: DataTypes.TEXT, allowNull: true },
  whatsapp_order: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'orders' });

// ─── OrderItem ────────────────────────────────────────
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  order_id: { type: DataTypes.UUID, allowNull: false },
  product_id: { type: DataTypes.UUID, allowNull: true },
  basket_id: { type: DataTypes.UUID, allowNull: true },
  name: { type: DataTypes.STRING(150), allowNull: false }, // snapshot
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  unit: { type: DataTypes.STRING(20), defaultValue: 'kg' },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'order_items' });

// ─── SubscriptionPlan ─────────────────────────────────
const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  basket_id: { type: DataTypes.UUID, allowNull: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  frequency: { type: DataTypes.ENUM('ONCE', 'WEEKLY', 'MONTHLY'), defaultValue: 'WEEKLY' },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_percent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  delivery_days: { type: DataTypes.JSON, allowNull: true }, // ['Monday', 'Thursday']
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'subscription_plans' });

// ─── Subscription ─────────────────────────────────────
const Subscription = sequelize.define('Subscription', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  plan_id: { type: DataTypes.UUID, allowNull: false },
  address_id: { type: DataTypes.UUID, allowNull: true },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'),
    defaultValue: 'ACTIVE',
  },
  payment_status: { type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'), defaultValue: 'PENDING' },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  next_delivery_date: { type: DataTypes.DATEONLY, allowNull: true },
  end_date: { type: DataTypes.DATEONLY, allowNull: true },
  paused_at: { type: DataTypes.DATE, allowNull: true },
  cancelled_at: { type: DataTypes.DATE, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'subscriptions' });

// ─── Delivery ─────────────────────────────────────────
const Delivery = sequelize.define('Delivery', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  order_id: { type: DataTypes.UUID, allowNull: false },
  delivery_partner_id: { type: DataTypes.UUID, allowNull: true },
  scheduled_date: { type: DataTypes.DATEONLY, allowNull: true },
  delivered_at: { type: DataTypes.DATE, allowNull: true },
  status: {
    type: DataTypes.ENUM('SCHEDULED', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'),
    defaultValue: 'SCHEDULED',
  },
  area: { type: DataTypes.STRING(100), allowNull: true },
  society: { type: DataTypes.STRING(100), allowNull: true },
  delivery_notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'deliveries' });

// ─── Review ───────────────────────────────────────────
const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  trial_request_id: { type: DataTypes.UUID, allowNull: true },
  order_id: { type: DataTypes.UUID, allowNull: true },
  overall_rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  quality_rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
  packing_rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
  delivery_rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true },
  continue_preference: { type: DataTypes.ENUM('YES', 'MAYBE', 'NO'), allowNull: true },
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'reviews' });

// ─── Associations ─────────────────────────────────────
User.hasMany(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(TrialRequest, { foreignKey: 'user_id' });
TrialRequest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Basket.hasMany(BasketItem, { foreignKey: 'basket_id', onDelete: 'CASCADE' });
BasketItem.belongsTo(Basket, { foreignKey: 'basket_id' });

Product.hasMany(BasketItem, { foreignKey: 'product_id' });
BasketItem.belongsTo(Product, { foreignKey: 'product_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', allowNull: true });

Order.hasOne(Delivery, { foreignKey: 'order_id' });
Delivery.belongsTo(Order, { foreignKey: 'order_id' });

SubscriptionPlan.belongsTo(Basket, { foreignKey: 'basket_id', allowNull: true });
Basket.hasMany(SubscriptionPlan, { foreignKey: 'basket_id' });

Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id' });
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'plan_id' });

Subscription.belongsTo(Address, { foreignKey: 'address_id', allowNull: true });

TrialRequest.hasOne(Review, { foreignKey: 'trial_request_id' });
Review.belongsTo(TrialRequest, { foreignKey: 'trial_request_id', allowNull: true });

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Product,
  Basket,
  BasketItem,
  TrialRequest,
  Order,
  OrderItem,
  SubscriptionPlan,
  Subscription,
  Delivery,
  Review,
};
