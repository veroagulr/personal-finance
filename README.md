# Personal Finance API · FastAPI + PostgreSQL + JWT

API REST para la gestión de finanzas personales: permite registrar usuarios, administrar ingresos y gastos, consultar un resumen financiero y apoyarse en la API de OpenAI para analizar la información. Los datos se guardan en PostgreSQL, el acceso está protegido con autenticación JWT y la aplicación incluye una interfaz web para usarla desde el navegador.

> **Estado: en desarrollo.** Es un proyecto de portafolio en evolución, con el que practico desarrollo backend, modelado de bases de datos, autenticación y consumo de servicios externos. Las funcionalidades listadas en el [estado del proyecto](#estado-del-proyecto-y-próximas-mejoras) pueden cambiar o ampliarse.

<!-- Agrega una captura del dashboard en docs/dashboard.png y descomenta la línea:
![Dashboard de finanzas](docs/dashboard.png)
-->

## Arquitectura

```mermaid
flowchart LR
    A[Frontend: HTML, CSS y JS] --> B[FastAPI: API REST]
    B --> C[Routers]
    B --> D[Security: JWT]
    B --> G[ai.py: OpenAI API]
    C --> E[SQLAlchemy ORM]
    E --> F[(PostgreSQL)]
```

## Tecnologías

Python (FastAPI, SQLAlchemy, Pydantic, Uvicorn) · PostgreSQL (pgAdmin) · JWT (python-jose, python-dotenv) · OpenAI API · HTML, CSS y JavaScript · Git/GitHub

## Estructura del repositorio

```
personal-finance/
├── app/
│   ├── main.py          # Punto de entrada de la aplicación
│   ├── database.py      # Conexión y sesión de base de datos
│   ├── models.py        # Modelos SQLAlchemy (tablas)
│   ├── schemas.py       # Esquemas Pydantic (validación)
│   ├── security.py      # Autenticación y JWT
│   ├── ai.py            # Integración con OpenAI
│   ├── routers/         # users, incomes, expenses, summary
│   └── frontend/        # HTML, CSS y JavaScript
├── requirements.txt
└── README.md
```

## Modelo de datos

Tres entidades principales, gestionadas con SQLAlchemy:

- **Usuario**: credenciales y datos de acceso.
- **Ingreso** y **Gasto**: movimientos financieros que pertenecen a un usuario.

## Módulos de la API

| Módulo | Archivo | Qué permite |
|---|---|---|
| Usuarios | `routers/users.py` | Registro, inicio de sesión y gestión de usuarios |
| Ingresos | `routers/incomes.py` | Crear, consultar, actualizar y eliminar ingresos |
| Gastos | `routers/expenses.py` | Crear, consultar, actualizar y eliminar gastos |
| Resumen | `routers/summary.py` | Consulta resumida de los movimientos financieros |
| IA | `ai.py` | Análisis de información financiera con OpenAI |

La documentación interactiva de todos los endpoints se genera automáticamente con Swagger UI en `/docs`.

## Decisiones de diseño

- **Estructura modular:** un router por recurso, para que `main.py` se mantenga pequeño y sea fácil agregar funcionalidades.
- **Modelos separados de esquemas:** `models.py` define cómo se guardan los datos y `schemas.py` qué entra y qué sale por la API, así no se exponen campos internos.
- **ORM en lugar de SQL manual:** SQLAlchemy abstrae el acceso a datos y reduce el riesgo de inyección SQL.
- **Credenciales fuera del código:** la clave del token, la conexión a la base de datos y la API key de OpenAI viven en variables de entorno.
- **IA aislada en su propio módulo:** si cambia el proveedor, solo se modifica `ai.py`.

## Cómo ejecutarlo

Requisitos: Python 3.10+, PostgreSQL y una API key de OpenAI.

```bash
git clone https://github.com/veroagulr/personal-finance.git
cd personal-finance
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

1. Crea una base de datos vacía en PostgreSQL (por ejemplo `personal_finance`).
2. Crea un archivo `.env` en la raíz del proyecto:

   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/personal_finance
   SECRET_KEY=una_clave_larga_y_aleatoria
   OPENAI_API_KEY=tu_api_key
   ```

   El archivo `.env` está en `.gitignore`: nunca subas tus claves a GitHub.
3. Ejecuta la aplicación: `fastapi dev app/main.py`
4. Abre `http://127.0.0.1:8000` para la interfaz web y `http://127.0.0.1:8000/docs` para la documentación de la API.

## Estado del proyecto y próximas mejoras

**Implementado**

- [x] Registro de usuarios y autenticación con JWT
- [x] Gestión de ingresos y gastos
- [x] Resumen financiero
- [x] Integración con OpenAI API
- [x] Interfaz web básica (acceso y dashboard)
- [x] Documentación automática con Swagger UI

**En desarrollo / pendiente**

- [ ] Mejorar el dashboard con gráficos
- [ ] Filtros por fechas y categorías
- [ ] Estadísticas y análisis de gastos
- [ ] Ampliar las funcionalidades de IA
- [ ] Pruebas automatizadas
- [ ] Reforzar la seguridad (expiración y renovación de tokens)
- [ ] Despliegue en la nube

## Autora

Veronica Aguilar · Estudiante de Ingeniería de Sistemas · [GitHub](https://github.com/veroagulr) · [LinkedIn]([https://linkedin.com/in/tu-perfil](https://www.linkedin.com/in/veronica-aguilar-mendoza)
