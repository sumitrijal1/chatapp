const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');

  // Read schema file
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  // First create database
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'chatapp'}`, (err) => {
    if (err) {
      console.error('Database creation error:', err);
      connection.end();
      process.exit(1);
    }
    console.log('Database created/verified');

    // Now use the database and run schema
    connection.query(`USE ${process.env.DB_NAME || 'chatapp'}`, (err) => {
      if (err) {
        console.error('USE database error:', err);
        connection.end();
        process.exit(1);
      }

      connection.query(schema, (err) => {
        if (err) {
          console.error('Schema execution error:', err);
          connection.end();
          process.exit(1);
        }
        console.log('✅ Database tables created successfully!');
        connection.end();
        process.exit(0);
      });
    });
  });
});
