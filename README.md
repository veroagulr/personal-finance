# 💰 Personal Finance API

Aplicación web para la **gestión de finanzas personales**, desarrollada con **Python y FastAPI**. El proyecto permite administrar ingresos y gastos, gestionar usuarios y consultar información financiera desde una API REST conectada a PostgreSQL.

El proyecto forma parte de mi portafolio de desarrollo y tiene como objetivo aplicar y fortalecer conocimientos en **desarrollo backend, bases de datos, APIs REST, autenticación e integración con inteligencia artificial**.

---

## 🚀 Funcionalidades

* 👤 Registro y gestión de usuarios.
* 🔐 Autenticación mediante JWT.
* 💵 Gestión de ingresos.
* 💸 Gestión de gastos.
* 📊 Consulta de resumen financiero.
* 🤖 Integración con OpenAI API.
* 🌐 Interfaz web para interactuar con la aplicación.
* 🗄️ Persistencia de datos utilizando PostgreSQL.
* 📚 Documentación automática de la API mediante Swagger UI.

---

## 🏗️ Arquitectura

El proyecto está organizado separando las principales responsabilidades de la aplicación:

```text
┌──────────────────────┐
│      Frontend        │
│   HTML / CSS / JS    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       FastAPI        │
│       REST API       │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Routers │  │ Security │
└────┬────┘  └──────────┘
     │
     ▼
┌──────────────────────┐
│      SQLAlchemy      │
│         ORM          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      PostgreSQL      │
└──────────────────────┘
```

---

## 🛠️ Tecnologías

### Backend

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **Pydantic**
* **Uvicorn**

### Base de datos

* **PostgreSQL**
* **pgAdmin**

### Autenticación y seguridad

* **JWT**
* **python-jose**
* **python-dotenv**

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**

### Inteligencia Artificial

* **OpenAI API**

### Control de versiones

* **Git**
* **GitHub**

---

## 📂 Estructura del proyecto

```text
personal-finance/
│
├── app/
│   ├── ai.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── __init__.py
│   │
│   ├── frontend/
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   │
│   │   ├── css/
│   │   │   └── style.css
│   │   │
│   │   └── js/
│   │       ├── app.js
│   │       └── dashboard.js
│   │
│   └── routers/
│       ├── users.py
│       ├── expenses.py
│       ├── incomes.py
│       ├── summary.py
│       └── __init__.py
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/veroagulr/personal-finance.git
cd personal-finance
```

### 2. Crear el entorno virtual

```bash
python -m venv venv
```

Activar el entorno virtual en Windows:

```bash
venv\Scripts\activate
```

### 3. Instalar las dependencias

```bash
pip install -r requirements.txt
```

---

## 🔐 Configuración

El proyecto utiliza variables de entorno para proteger información sensible.

Crea un archivo `.env` en la raíz del proyecto:

```env
OPENAI_API_KEY=tu_api_key
```

> ⚠️ No compartas ni subas tu API key a GitHub.

El archivo `.env` está incluido en `.gitignore`.

También debes configurar la conexión a **PostgreSQL** de acuerdo con la configuración utilizada por el proyecto.

---

## ▶️ Ejecutar la aplicación

Con el entorno virtual activado:

```bash
fastapi dev app/main.py
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

### 📚 Documentación de la API

FastAPI genera automáticamente la documentación interactiva:

```text
http://127.0.0.1:8000/docs
```

Desde Swagger UI se pueden consultar y probar los endpoints disponibles.

---

## 📡 Módulos principales

### 👤 Usuarios

Permite gestionar los usuarios y el proceso de autenticación de la aplicación.

### 💸 Gastos

Permite registrar, consultar, actualizar y eliminar gastos.

### 💵 Ingresos

Permite gestionar los ingresos registrados por el usuario.

### 📊 Resumen financiero

Permite obtener información resumida sobre los movimientos financieros.

### 🤖 Inteligencia Artificial

El proyecto incorpora una integración con **OpenAI API** como parte de la implementación de funcionalidades inteligentes orientadas al análisis de información financiera.

---

## 🔒 Seguridad

La aplicación implementa mecanismos de autenticación mediante **JSON Web Tokens (JWT)**.

Las credenciales y claves de servicios externos se gestionan mediante variables de entorno para evitar almacenarlas directamente en el código fuente.

---

## 📈 Aprendizajes

Durante el desarrollo de este proyecto estoy aplicando conocimientos relacionados con:

* Diseño y desarrollo de APIs REST.
* Desarrollo de aplicaciones backend con FastAPI.
* Modelado y gestión de bases de datos.
* ORM mediante SQLAlchemy.
* Autenticación y autorización con JWT.
* Manejo de variables de entorno.
* Integración de servicios externos mediante APIs.
* Desarrollo de interfaces web.
* Organización modular de proyectos Python.
* Control de versiones con Git y GitHub.

---

## 🔮 Próximas mejoras

El proyecto continuará evolucionando con nuevas funcionalidades, entre ellas:

* 📊 Mejorar el dashboard financiero.
* 🤖 Ampliar las funcionalidades de IA.
* 📈 Incorporar análisis y estadísticas financieras.
* 🔎 Agregar filtros por fechas y categorías.
* 🧪 Implementar pruebas automatizadas.
* 🔐 Mejorar los mecanismos de seguridad.
* ☁️ Preparar el proyecto para despliegue en la nube.

---

## 👩‍💻 Autora

**Veronica Aguilar**

Estudiante de **Ingeniería de Sistemas**, interesada en:

* Desarrollo de software
* Data Engineering
* Automatización
* Inteligencia Artificial
* Bases de datos

Este proyecto forma parte de mi portafolio personal y representa mi proceso de aprendizaje y desarrollo de aplicaciones orientadas a datos.

---

⭐ **Proyecto en desarrollo**
