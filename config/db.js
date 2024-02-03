const mysql = require('mysql');

const config = {
  host: 'localhost',
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
};

const pool = mysql.createPool(config);

module.exports = pool;
