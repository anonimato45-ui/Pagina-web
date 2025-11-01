const URL_BASE = 'http://localhost:3000'; 
const updateForm = document.getElementById('updateForm');
const mensajeUpdate = document.getElementById('mensajeUpdate');

updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldEmail = document.getElementById('oldEmail').value;
    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    
    const datosUpdate = {
        oldEmail: oldEmail,
        username: newUsername, 
        newEmail: newEmail,
        newPassword: newPassword
    };

    try {
        const response = await fetch(`${URL_BASE}/user`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUpdate)
        });

        const data = await response.json();
        
        if (response.ok) {

            // Actualizar datos de sesión
            localStorage.setItem('userEmail', newEmail);
            sessionStorage.setItem('username', newUsername);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            mensajeUpdate.style.color = 'green';
            mensajeUpdate.textContent = `✅ ¡Cuenta actualizada!`;
            
            // Esperar a que el mensaje se muestre antes de redireccionar
            setTimeout(() => {
                window.location.href = 'Pagina_trabajo.html';
            }, 1000); 
        } else {
            mensajeUpdate.style.color = 'red';
            mensajeUpdate.textContent = `Error al actualizar: ${data.message}`;
        }
    } catch (error) {
        mensajeUpdate.textContent = 'Error de conexión con la API.';
        console.error("PUT Error:", error);
    }
});

const deleteForm = document.getElementById('deleteForm');
const mensajeDelete = document.getElementById('mensajeDelete');

deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailDelete = document.getElementById('emailDelete').value;

    if (!confirm(`¿Estás SEGURO de querer ELIMINAR la cuenta con email ${emailDelete}? Esta acción es irreversible.`)) {
        return; 
    }

    try {
        const response = await fetch(`${URL_BASE}/user`, {
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailDelete }) 
        });

        const data = await response.json();
        
        if (response.ok) {
            mensajeDelete.style.color = 'green';
            mensajeDelete.textContent = `✅ ${data.message}`;
            
        
            alert("Tu cuenta ha sido eliminada. Serás redirigido al registro.");
            window.location.href = 'registro.html'; 
        } else {
            mensajeDelete.style.color = 'red';
            mensajeDelete.textContent = `Error al eliminar: ${data.message}`;
        }

    } catch (error) {
        mensajeDelete.textContent = 'Error de conexión con la API.';
        console.error("DELETE Error:", error);
    }
});
