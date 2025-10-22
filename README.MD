Sistema de Gestión de Usuarios y Perfil

Este proyecto implementa un sistema básico de gestión de usuarios que permite el inicio de sesión, la visualización de un perfil de usuario, y la actualización de la información personal (nombre, email y contraseña) con persistencia de datos a través de una API de backend.

 Tecnologías Utilizadas

Frontend: HTML5, CSS3, JavaScript

Backend: Node.js (Express)

Base de Datos: MySQL

Gestión de Dependencias: npm

Funcionalidades Clave

1. Autenticación (Login.html)

Permite a los usuarios ingresar al sistema con credenciales válidas.

Guarda los datos del usuario (Nombre, Email) en la sesión del navegador (sessionStorage) tras un inicio de sesión exitoso.

2. Página de Trabajo (Pagina_trabajo.html)

Página principal accesible tras el login.

Utiliza los datos almacenados en sessionStorage para personalizar la bienvenida.

3. Gestión de Perfil (perfil.html)

Muestra el nombre y email actuales del usuario.

Contiene un formulario de actualización para modificar y borrar datos o la cuenta.

4. Actualización de Datos (Ruta PUT /user)

La funcionalidad de actualización de datos (Pagina_de_perfil) maneja la modificación de:

Nombre de Usuario

Email

Contraseña

Una vez que el backend confirma la actualización, el frontend actualiza automáticamente la sessionStorage para reflejar los nuevos datos sin necesidad de que el usuario vuelva a iniciar sesión.

Estructura del Proyecto

La estructura del proyecto separa claramente la lógica del servidor (Backend) de la interfaz de usuario (Frontend).

Pagina web/
├── Backend/
│   ├── node_modules/       # Dependencias de Node.js (ignorado por .gitignore)
│   ├── .env                # Archivo de configuración de credenciales (ignorado por .gitignore)
│   ├── db_config.js        # Configuración de conexión a MySQL
│   ├── main.js             # API principal (Express, maneja /login, /register, /user)
│   ├── package.json        # Dependencias del proyecto
│   └── Tabla.sql           # Script de creación de la tabla de usuarios
├── Frontend/
│   ├── js/
│   │   ├── login.js        # Lógica de inicio de sesión
│   │   ├── perfil.js       # Lógica de actualización de perfil
│   │   └── registro.js     # Lógica de registro de nuevos usuarios
│   ├── login.html          # Interfaz de inicio de sesión
│   ├── Pagina_de_perfil.html # Area de actualizacion de datos
│   ├── Pagina_trabajo.html # Página de bienvenida
│   └── registro.html       # Interfaz de registro
├── .gitignore              # Archivos y carpetas a excluir de Git (ej. node_modules, .env)
└── README.md

🚀 Cómo Ejecutar el Proyecto

Para poner en marcha este proyecto, necesitará ejecutar tanto el frontend (abrir archivos HTML) como el backend (ejecutar la API con Node.js).

Instalar dependencias de Node.js:

npm install

express 
cors
dotenv
mysql2

Iniciar el Servidor Backend (API):

node main.js

# Asegúrese de que su base de datos MySQL esté corriendo y las credenciales estén en el archivo .env


Acceder al Frontend:
Abra el archivo Pagina_trabajo.html en su navegador.

Desarrollado para la entrega del curso/asignatura [Programacion de software].