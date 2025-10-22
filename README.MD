# 🧩 Sistema de Gestión de Usuarios y Perfiles

## 📖 Introducción
Este proyecto implementa un **sistema web completo de gestión de usuarios**, que cubre el ciclo de vida básico de un usuario:

- Registro  
- Autenticación (login)  
- Gestión y edición de perfil  

El **backend** está desarrollado con **Node.js** y utiliza **MySQL** para la persistencia de datos.  
El **frontend** está implementado en **HTML, CSS y JavaScript**, utilizando `sessionStorage` para mantener el estado de autenticación.

---

## 🎯 Objetivos y Funcionalidades

| Funcionalidad | Descripción | Archivos Clave |
|----------------|-------------|----------------|
| **Registro** | Creación de nuevas cuentas de usuario. | `registro.html`, `Frontend/js/registro.js` |
| **Autenticación** | Inicio de sesión con credenciales y almacenamiento de sesión. | `login.html`, `Frontend/js/login.js` |
| **Perfil** | Visualización y modificación de nombre, correo y contraseña. | `Pagina_de_perfil.html`, `Frontend/js/perfil.js` |
| **Persistencia** | Actualización inmediata del estado de sesión tras modificaciones en BD. | `Frontend/js/perfil.js`, `Backend/main.js` |

---

## 🏗️ Arquitectura del Proyecto

Estructura modularizada que separa la **lógica de presentación (Frontend)** de la **lógica del servidor (Backend)**:
Pagina web/
├── Backend/
│ ├── db_config.js # Configuración de conexión a MySQL
│ ├── main.js # Servidor principal (Express) y rutas API
│ ├── package.json # Dependencias y metadatos del servidor
│ ├── Tabla.sql # Script SQL para crear la tabla de usuarios
│ ├── node_modules/ # Dependencias instaladas (IGNORADO)
│ └── .env # Variables de entorno (IGNORADO)
│
├── Frontend/
│ ├── js/
│ │ ├── login.js # Lógica de inicio de sesión
│ │ ├── perfil.js # Lógica de actualización de perfil
│ │ └── registro.js # Lógica de registro
│ ├── login.html # Interfaz de login
│ ├── Pagina_de_perfil.html # Interfaz de perfil
│ ├── Pagina_trabajo.html # Página principal/dashboard
│ └── registro.html # Interfaz de registro
│
├── .gitignore # Reglas de exclusión de Git
└── README.md # Documentación del proyecto

---

## ⚙️ Dependencias del Backend

Las dependencias se instalan automáticamente con `npm install` dentro del directorio `Backend/`.

| Paquete | Descripción |
|----------|-------------|
| **express** | Framework web rápido y minimalista para Node.js |
| **dotenv** | Carga variables de entorno desde un archivo `.env` |
| **mysql2** | Cliente para conectarse y operar con MySQL |
| **cors** | Middleware para habilitar CORS (comunicación entre frontend y backend) |

---

## 🚀 Despliegue y Ejecución

### 🖥️ Requisitos Previos
- Tener instalado **Node.js**
- Tener en ejecución un servidor **MySQL**

### 🔧 Backend (Servidor API)

1. **Instalar dependencias:**
   ```bash
   cd Backend
   npm install
