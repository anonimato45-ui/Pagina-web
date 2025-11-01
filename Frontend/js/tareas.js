const URL_BASE = 'http://localhost:3000';
// Elementos del DOM
const taskForm = document.getElementById('task-form');
const taskFormTitle = document.getElementById('task-form-title');
const tasksContainer = document.getElementById('taskList');
const taskInput = document.getElementById('task-title');
const taskDescription = document.getElementById('task_description'); // textarea para la descripción
const userDisplay = document.getElementById('userDisplay');
const username = localStorage.getItem('username');
let editingTaskId = null;

// Mostrar usuario o redirigir
if (username) {
    userDisplay.textContent = username;
} else {
    window.location.href = './login.html';
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = './login.html';
        return;
    }

    const username = localStorage.getItem('username');
    if (userDisplay && username) {
        userDisplay.textContent = username;
    } else if (userDisplay) {
        userDisplay.textContent = userEmail;
    }

    await loadTasks();
});

// Enviar formulario
taskForm.addEventListener('submit', handleTaskSubmit);

async function loadTasks() {
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            window.location.href = './login.html';
            return;
        }

        const response = await fetch(`${URL_BASE}/api/tasks?email=${userEmail}`);
        if (!response.ok) throw new Error('Error al cargar tareas');

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        showAlert('Error al cargar las tareas: ' + error.message, 'danger');
    }
}

async function handleTaskSubmit(e) {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }

    const task_text = taskInput.value.trim();
    const task_description = taskDescription.value.trim();

    if (!task_text) {
        showAlert('El título de la tarea no puede estar vacío', 'warning');
        return;
    }

    try {
        const url = editingTaskId 
            ? `${URL_BASE}/api/tasks/${editingTaskId}`
            : `${URL_BASE}/api/tasks`;

        const method = editingTaskId ? 'PUT' : 'POST';
        const body = JSON.stringify({
            email: userEmail,
            task_text,
            task_description,
            completed: false
        });

        const response = await fetch(url, {
            method,
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        });

        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || 'Error al guardar tarea');

        showAlert(editingTaskId ? 'Tarea actualizada' : 'Tarea creada', 'success');

        taskForm.reset();
        editingTaskId = null;
        taskFormTitle.textContent = 'Nueva Tarea';
        document.getElementById('cancel-edit').style.display = 'none';

        await loadTasks();
    } catch (error) {
        console.error('Error al guardar tarea:', error);
        showAlert('Error al guardar la tarea', 'danger');
    }
}

async function toggleTaskStatus(taskId, completed) {
    try {
        const response = await fetch(`${URL_BASE}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed })
        });

        if (!response.ok) throw new Error('Error al actualizar estado');
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al actualizar el estado', 'danger');
    }
}

async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
        const response = await fetch(`${URL_BASE}/api/tasks/${taskId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar tarea');

        showAlert('Tarea eliminada', 'success');
        await loadTasks();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar la tarea', 'danger');
    }
}

function editTask(task) {
    editingTaskId = task.id;
    taskInput.value = task.task_text;
    taskDescription.value = task.task_description || '';
    taskFormTitle.textContent = 'Editar Tarea';
    document.getElementById('cancel-edit').style.display = 'block';
    taskInput.focus();
}

function cancelEdit() {
    editingTaskId = null;
    taskForm.reset();
    taskFormTitle.textContent = 'Nueva Tarea';
    taskDescription.value = '';
    document.getElementById('cancel-edit').style.display = 'none';
}

function renderTasks(tasks) {
    if (!tasksContainer) {
        console.error('No se encontró el contenedor de tareas');
        return;
    }

    tasksContainer.innerHTML = '';

    if (!Array.isArray(tasks) || tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="col-12 text-center text-muted my-5">
                <i class="fas fa-tasks fa-3x mb-3"></i>
                <p>No hay tareas pendientes. ¡Añade una nueva tarea!</p>
            </div>
        `;
        return;
    }

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 ${task.completed ? 'border-success' : 'border-warning'} shadow-sm">
                <div class="card-body">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" 
                            id="task-${task.id}"
                            ${task.completed ? 'checked' : ''}
                            onchange="toggleTaskStatus(${task.id}, ${!!task.completed})">
                        <label class="form-check-label ${task.completed ? 'text-decoration-line-through' : ''}"
                            for="task-${task.id}">
                            <strong>${task.task_text || 'Sin título'}</strong>
                        </label>
                        <p class="text-muted mt-2" style="white-space: pre-wrap;">
                            ${task.task_description || 'Sin detalles adicionales'}
                        </p>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i> 
                        ${task.created_at ? new Date(task.created_at).toLocaleString() : 'Fecha no disponible'}
                    </small>
                    <div class="mt-3 d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-primary me-2" 
                            onclick="editTask(${JSON.stringify(task).replace(/"/g, "'")})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

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


