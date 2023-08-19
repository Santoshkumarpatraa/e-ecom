const { Sequelize } = require('sequelize');

module.exports = {
  sequelize: new Sequelize({
    dialect: 'postgres',
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: 5432, // Default PostgreSQL port
  }),
};
