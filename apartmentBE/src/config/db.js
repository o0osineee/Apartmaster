const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../.env' }); // Adjust path if .env is elsewhere relative to this file

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test the connection (optional, but good for immediate feedback)
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database.');
    connection.release(); // Release the connection back to the pool
  })
  .catch(error => {
    console.error('Error connecting to the MySQL database:', error.message);
    // Exit process if DB connection fails on startup, or handle appropriately
    // process.exit(1);
  });

module.exports = pool; 