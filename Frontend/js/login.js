const URL_BASE = 'http://localhost:3000'; 
const form = document.getElementById('loginFormulario');
const mensaje = document.getElementById('mensajeLogin'); 


form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('emailLogin').value.trim();
    const password = document.getElementById('passwordLogin').value;

    const datosLogin = {
        email: email, 
        password: password 
    };

    try {
        const response = await fetch(`${URL_BASE}/login`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosLogin) 
        });

        const data = await response.json(); 
        
         if (response.ok) { 
            const usernameToStore = data.username || email.split('@')[0];
            localStorage.setItem('userEmail', email);
            localStorage.setItem('username', usernameToStore);
            localStorage.setItem('isLoggedIn', 'true');

 
            mensaje.style.color = 'green';
            mensaje.textContent = `🥳 ¡Bienvenido, ${data.username || 'usuario'}! Redirigiendo...`; // Mejorar el mensaje
            form.reset(); 

             setTimeout(()  => {

             window.location.href = 'Pagina_trabajo.html';}, 1000);  
        
        } else { 
            mensaje.style.color = 'red';
            mensaje.textContent = `❌ ${data.message || 'Credenciales inválidas.'}`;
        }

    } catch (error) {
        mensaje.style.color = 'red';
        mensaje.textContent = '❌ Error de conexión. Asegúrate de que la API está corriendo en http://localhost:3000.';
        console.error("Error de Fetch:", error);
    }
});

