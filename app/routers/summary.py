from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Expense, Income, User    
from app.security import get_current_user


router = APIRouter(
    prefix="/financial-summary",
    tags=["Financial Summary"]
)


@router.get("")
def financial_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == current_user.id
    ).scalar()

    total_expense = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).scalar()

    total_income = total_income or 0
    total_expense = total_expense or 0

    balance = total_income - total_expense

    category_results = db.query(
        Expense.category,
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).group_by(
        Expense.category
    ).order_by(
        func.sum(Expense.amount).desc()
    ).all()

    expenses_by_category = {
        category: amount
        for category, amount in category_results
    }

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "expenses_by_category": expenses_by_category
    }

@router.get("/month")
def monthly_financial_summary(
    year: int = Query(ge=2000, le=2100),
    month: int = Query(ge=1, le=12), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == current_user.id,
        func.extract("year", Income.date) == year,
        func.extract("month", Income.date) == month
    ).scalar()

    total_expense = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id,
        func.extract("year", Expense.date) == year,
        func.extract("month", Expense.date) == month
    ).scalar()

    category_results = db.query(
            Expense.category,
            func.sum(Expense.amount)
      ).filter(
            Expense.user_id == current_user.id,
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month
      ).group_by(
            Expense.category
      ).all()

    total_income = total_income or 0
    total_expense = total_expense or 0
    
    balance = total_income - total_expense

    by_category = {
            category: amount
            for category, amount in category_results
      }
    
    return {
        "year": year,
        "month": month,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "by_category": by_category
    }

@router.get("/analysis")
def financial_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == current_user.id
    ).scalar() or 0

    total_expense = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).scalar() or 0

    balance = total_income - total_expense

    if total_income > 0:
        savings_rate = (balance / total_income) * 100
        expense_rate = (total_expense / total_income) * 100
    else:
        savings_rate = 0
        expense_rate = 0

    category_result = db.query(
        Expense.category,
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).group_by(
        Expense.category
    ).order_by(
        func.sum(Expense.amount).desc()
    ).first()

    if category_result:
        highest_category = category_result[0]
        highest_category_amount = category_result[1]
    else:
        highest_category = None
        highest_category_amount = 0

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "savings_rate": round(savings_rate, 2),
        "expense_rate": round(expense_rate, 2),
        "highest_expense_category": highest_category,
        "highest_expense_amount": highest_category_amount
    }

@router.get("/recommendations")
def financial_recommendations(
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    total_income = db.query(
        func.sum(Income.amount)
    ).filter(
        Income.user_id == current_user.id
    ).scalar() or 0
    
    total_expense = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).scalar() or 0
    
    balance = total_income - total_expense
    
    if total_income > 0:
        savings_rate = (balance / total_income) * 100
        expense_rate = (total_expense / total_income) * 100
    else:
        savings_rate = 0
        expense_rate = 0

    recommendations = []

    if total_income == 0:
        recommendations.append(
            "No tienes ingresos registrados. "
            "Registra tus ingresos para obtener una analisis financiero"
        )

    elif savings_rate < 0:
        recommendations.append(
            "Tus gastos superan los ingresos. "
            "Revisa tus gastos y considera reducir los gastos no esenciales"
        )

    elif savings_rate < 10:
        recommendations.append(
            "Tu tasa de ahorro es baja. "
            "Intenta reducir algunos gastos para aumentar tu capacidad de ahorro"
        )
    elif savings_rate < 20:
        recommendations.append(
            "Mantienes una tasa de ahorro moderada. "
            "Podrías intentar aumentarla gradualmente."
        )

    else: 
        recommendations.append(
            "Mantienes una buena tasa de ahorro. "
            "Continua controlando tus gastos y mantiendo este habito"
        )

    if total_income > 0 and expense_rate > 80:
        recommendations.append(
            "Tus gastos representan mas del 80% de tus ingresos. "
            "Revisa especialmente tus categorias con mayor consumo"
        )

    category_result = db.query(
        Expense.category,
        func.sum(Expense.amount)
    ).filter(
        Expense.user_id == current_user.id
    ).group_by(
        Expense.category
    ).order_by(
        func.sum(Expense.amount).desc()
    ).first()

    if category_result:
        category = category_result[0]
        amount = category_result[1]

        recommendations.append(
            f"Tu categoría con mayor gasto es '{category}', "
            f"con S/ {amount:.2f}."
        )

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "savings_rate": round(savings_rate, 2),
        "expense_rate": round(expense_rate, 2),
        "recommendations": recommendations
    } 