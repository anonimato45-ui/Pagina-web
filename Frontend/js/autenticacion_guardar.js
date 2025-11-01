
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

function renderizarAccionesAuth(username, isLoggedIn) {
    const authActionsContainer = document.getElementById('auth-actions');
    if (!authActionsContainer) return;
    
    if (isLoggedIn && username) {
        authActionsContainer.innerHTML = `
            <li class="nav-item dropdown ms-lg-3">
                <a class="nav-link dropdown-toggle btn btn-primary text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user me-1"></i> ${username.split(' ')[0]} 
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="Pagina_de_perfil.html">
                        <i class="fas fa-cog me-2"></i> Mi Perfil
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" id="navLogoutBtn">
                        <i class="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                    </button></li>
                </ul>
            </li>
        `;

        const navLogoutBtn = document.getElementById('navLogoutBtn');
        if (navLogoutBtn) {
            navLogoutBtn.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = './login.html';
            });
        }
    } else {
        authActionsContainer.innerHTML = `
            <a class="nav-link btn btn-primary text-white ms-lg-3" href="./login.html">
                <i class="fas fa-sign-in-alt me-1"></i> Iniciar Sesión
            </a>
        `;
    }
}

async function inicializarPagina() {
    const userEmail = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');

    if (!userEmail) {
        renderizarAccionesAuth(null, false);
        return;
    }

    try {
        renderizarAccionesAuth(username || userEmail.split('@')[0], true);
    } catch (error) {
        console.error('Error:', error);
        localStorage.clear();
        renderizarAccionesAuth(null, false);
        window.location.href = 'login.html';
    }
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', inicializarPagina);
