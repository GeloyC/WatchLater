import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 5,
//     queueLimit: 0,
// });


// console.log('Succesfull connected to database!');

// export default db;


let db;

if (!global._vercel_mysql_pool) {
    global._vercel_mysql_pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 2,
        queueLimit: 0,
        enableKeepAlive: true,
        ssl: { rejectUnauthorized: true } // 👈 Add this
    });
    console.log('✅ New MySQL connection pool created');
}

db = global._vercel_mysql_pool;
export default db;