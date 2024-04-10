import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10, // Adjust according to your needs
    queueLimit: 0
});

export default pool;
