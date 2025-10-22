const express = require('express'); 
const cors = require('cors');
const conexion = require('./db_config');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.DB_PORT || 3000; 

app.use(express.json());
app.use(cors());


app.post('/register', (req, res) => {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    
   
    const query = `INSERT INTO RegistrationUsers (UserName, Email, password, Registration_Date) VALUES (?, ?, ?, NOW())`;
    
    conexion.query(
        query,
        [username, email, password],
        (err, results) => {   
            if (err) {
                console.error("Error de registro en DB:", err);
                
               
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "El email ya está registrado. Por favor, inicia sesión." });
                }
                
              
                return res.status(500).json({ message: "Error interno del servidor. Contacte al administrador." });
            }
     
            res.status(201).json({ id: results.insertId, username, email, message: "Usuario registrado con éxito." });
        }
    );
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "El email y la contraseña son obligatorios." });
    }

    const query = `SELECT id, UserName, password FROM RegistrationUsers WHERE Email = ?`;

    conexion.query(query, [email], (error, results) => {
        if (error) {
            console.error("Error en la consulta de login:", error);
            return res.status(500).json({ message: "Error interno del servidor." });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Email o contraseña incorrectos." });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: "Email o contraseña incorrectos." });
        }

      
        res.status(200).json({ 
            message: "✅ Login exitoso.",
            userId: user.id,
            username: user.UserName 
        });
    });
});


app.get('/user', (req, res) => {
    const query ='SELECT id, UserName, Email, Registration_Date FROM RegistrationUsers';
    
    conexion.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener datos:", error); 
            return res.status(500).json({ message: "Error en la base de datos" });
        }   
        res.status(200).json(results);
    }); 
});


app.put('/user', (req, res) => {
             const {oldEmail, username, newEmail, newPassword} = req.body;

             if (!oldEmail || !username || !newEmail || !newPassword){
              return res.status(400).json({ message: "Todos los campos son obligatorios." });
               }
           const query = 'UPDATE RegistrationUsers SET UserName = ?, Email = ?, password = ? WHERE Email = ?';

    conexion.query(query, [username, newEmail, newPassword, oldEmail], (error, results) => {
        if (error) {
            console.error("Error al actualizar datos:", error);
            return res.status(500).json({ message: "Error en la base de datos" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ 
            message: "Usuario actualizado correctamente",
            updateEmail: newEmail,
            username: username
        });
    });
});       


app.delete('/user', (req, res) => {
    
    const { email } = req.body; 

    if (!email) {
        return res.status(400).json({ message: "El email del usuario a eliminar es obligatorio." });
    }
    
    const query = `DELETE FROM RegistrationUsers WHERE Email = ?`;

    conexion.query(query, [email], (error, results) => {
        if (error) {
            console.error("Error al eliminar usuario:", error);
            return res.status(500).json({ message: "Error interno del servidor al eliminar." });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado para eliminar." });
        }

        res.status(200).json({ message: `✅ Usuario con email ${email} eliminado con éxito.` });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
});
