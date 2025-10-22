const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


const conexion = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, 
    waitForConnections: true, 
    connectionLimit: process.env.DB_connectionLimit,       
    queueLimit: 0             
});
    

module.exports = conexion; 


conexion.on('error', (err) => {
    console.error('Error fatal en el Pool de MySQL:', err);
  
});


conexion.getConnection((err, connection) => {
    if (err) {
       
        console.error('*** ERROR AL CONECTAR CON LA BASE DE DATOS INICIALMENTE ***', err.code);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
    connection.release(); 
});