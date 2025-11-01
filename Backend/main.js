const express = require('express'); 
const cors = require('cors');
const conexion = require('./db_config');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/register', (req, res) => {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    conexion.query(
        `INSERT INTO RegistrationUsers (UserName, Email, password) VALUES (?, ?, ?)`,
        [username, email, password],
        (err, results) => {   
            if (err) return res .status(500).json({ message: "Error interno del servidor." });
            res.json({ id: results.insertId, username, email });
        }
    );
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

    const {oldEmail, username, newEmail} = req.body;

    if (!oldEmail || !username || !newEmail) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const query = 'UPDATE RegistrationUsers SET UserName = ?, Email = ? WHERE Email = ?';

    conexion.query(query, [username, newEmail, oldEmail], (error, results) => {
        if (error) {
            console.error("Error al actualizar datos:", error);
            return res.status(500).json({ message: "Error en la base de datos" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }       

        res.status(200).json({ 
            message: "Usuario actualizado correctamente",
        updateEmail: newEmail
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

// Rutas para tareas
app.post('/api/tasks', (req, res) => {
    const { email, task_text, task_description } = req.body;
    if (!email || !task_text) {
        return res.status(400).json({ message: 'Email y texto de la tarea son requeridos.' });
    }

    // Primero obtener el user_id
    conexion.query('SELECT id FROM RegistrationUsers WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const user_id = results[0].id;
        // Insertar la tarea
        conexion.query(
            'INSERT INTO tasks (user_id, task_text, task_description) VALUES (?, ?, ?)',
            [user_id, task_text, task_description],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al guardar la tarea.' });
                }
                res.status(201).json({ id: results.insertId, task_text, task_description, created_at: new Date(), completed: false });
            });
        });
    });

app.get('/api/tasks', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email es requerido.' });
    }

    conexion.query(
        `SELECT t.id, t.task_text, t.task_description, t.completed FROM tasks t
         INNER JOIN RegistrationUsers u ON t.user_id = u.id
         WHERE u.Email = ?
         ORDER BY t.created_at DESC`,
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener las tareas.' });
            }
            res.json(results);
        }
    );
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task_text, task_description, completed } = req.body;
    const updateFields = [];
    const values = [];

    if (task_text !== undefined) {
        updateFields.push('task_text = ?');
        values.push(task_text);
    }
    if (task_description !== undefined) {
        updateFields.push('task_description = ?');
        values.push(task_description);
    }
    if (completed !== undefined) {
        updateFields.push('completed = ?');
        values.push(completed);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No hay campos para actualizar.' });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;
    
    conexion.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar la tarea.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        res.json({ message: 'Tarea actualizada correctamente.' });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    
    conexion.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar la tarea.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        res.json({ message: 'Tarea eliminada correctamente.' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const query = 'SELECT id, UserName, password FROM RegistrationUsers WHERE Email = ?';

    conexion.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error durante el login:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = results[0];
        
        if (password !== user.password) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

    
        res.json({ 
            message: 'Inicio de sesión exitoso.', 
            username: user.UserName, 
            userId: user.id
        });
    });
});



app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:3000`);
});