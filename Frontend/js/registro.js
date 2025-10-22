const URL_BASE = 'http://localhost:3000'; 
const form = document.getElementById('registroFormulario'); 
const mensaje = document.getElementById('mensajeRegistro'); 

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const username = document.getElementById('nombreCompleto').value.trim();
    const email = document.getElementById('emailRegistro').value.trim();
    const password = document.getElementById('passwordRegistro').value;

    const datosRegistro = {
        username: username, 
        email: email,
        password: password
    };

    try {
        const response = await fetch(`${URL_BASE}/register`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRegistro) 
        });

        const data = await response.json(); 
        
        if (response.ok) { 
            mensaje.style.color = 'green';
            mensaje.textContent = `🥳 ¡Registro exitoso para ${data.username}! Serás redirigido.`;
            form.reset(); 
            
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000); 

        } else { 
            mensaje.style.color = 'red';
            mensaje.textContent = `❌ Error al registrar: ${data.message}`;
        }

    } catch (error) {
        mensaje.style.color = 'red';
        mensaje.textContent = '❌ Error de conexión. Asegúrate de que la API está corriendo en http://localhost:3000.';
        console.error("Fetch Error:", error);
    }
});
