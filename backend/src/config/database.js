const { Sequelize } = require('sequelize');
const path = require('path');

const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dbDialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'palvii_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      dialect: 'mysql',
      logging: false,
      define: {
        underscored: true,
        timestamps: true,
      },
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../../palvii.sqlite'),
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
    },
  });
}

module.exports = { sequelize, Sequelize };
