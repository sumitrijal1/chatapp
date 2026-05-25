import mysql from 'mysql2/promise'   // ✅ change this
import dotenv from 'dotenv'
dotenv.config()

const promisepool = mysql.createPool({   // ✅ createPool directly
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chatapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

promisepool.getConnection()
    .then(conn => {
        console.log('MySQL connected')
        conn.release()
    })
    .catch(err => {
        console.error('MySQL connection error:', err.message)
    })

export default promisepool