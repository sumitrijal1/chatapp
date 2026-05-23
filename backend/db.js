const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chatapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisepool = pool.promise();

promisepool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err.message);
  });

module.exports = promisepool;