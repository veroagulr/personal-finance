from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import expenses, incomes,summary, users

app = FastAPI(title = "API de Finanzas Personales")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(expenses.router)
app.include_router(incomes.router)
app.include_router(summary.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {
        "message": "API de Finanzas Personales"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }

