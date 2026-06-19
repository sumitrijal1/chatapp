import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const promisepool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chatapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable connection keep-alive
    enableKeepAlive: true,
    // Allow multiple statements per query
    multipleStatements: false,
    // Connection idle timeout (in milliseconds) - 5 minutes
    idleTimeout: 300000
})

// Add error event listener for connection failures
promisepool.on('error', (err) => {
    console.error('MySQL Pool Error:', err.code, err.message)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
    }
    if (err.code === 'PROTOCOL_ERROR') {
        console.error('Database protocol error.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
    }
    if (err.code === 'ER_AUTHENTICATION_PLUGIN_ERROR') {
        console.error('Database authentication plugin error.')
    }
})

// Test initial connection
promisepool.getConnection()
    .then(conn => {
        console.log('MySQL connected successfully')
        conn.release()
    })
    .catch(err => {
        console.error('MySQL connection error:', err.message)
        process.exit(1)
    })

export default promisepool

// db.js is the bridge that lets your Node app and MySQL talk to each other, 
// continuously, while your server is running.