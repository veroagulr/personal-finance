from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Expense, User
from app.schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.security import get_current_user
from datetime import date

router = APIRouter(
    prefix = "/expenses",
    tags = ["Expenses"]
)

@router.post("", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = Expense(
        description = expense.description,
        amount = expense.amount,
        category = expense.category,
        date = expense.date,
        user_id = current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense

@router.get("", response_model=list[ExpenseResponse])
def get_expenses(
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    )

    if category:
        query = query.filter(
            Expense.category == category
        )

    if start_date:
        query = query.filter(
            Expense.date >= start_date
        )

    if end_date:
        query = query.filter(
            Expense.date <= end_date
        )

    offset = (page - 1) * limit
    expenses = query.order_by(
         Expense.date.desc()
      ).offset(offset).limit(limit).all()

    return expenses

@router.get("/stats")
def get_expense_stats(
      db: Session = Depends(get_db)
):
      total = db.query(
            func.sum(Expense.amount)
      ).scalar()

      category_results = db.query(
            Expense.category,
            func.sum(Expense.amount)
      ).group_by(
            Expense.category
      ).all()

      by_category = {
            category: amount
            for category, amount in category_results
      }

      return{
            "total": total or 0,
            "by_category": by_category
      }

@router.get("/stats/month")
def get_monthly_expenses(
      year: int,
      month: int,
      db: Session = Depends(get_db)
):
      total = db.query(
            func.sum(Expense.amount)
      ).filter(
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month
      ).scalar()

      category_results = db.query(
            Expense.category,
            func.sum(Expense.amount)
      ).filter(
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month
      ).group_by(
            Expense.category
      ).all()

      by_category = {
            category: amount
            for category, amount in category_results
      }

      return {
            "year": year,
            "month": month,
            "total": total or 0,
            "by_category": by_category
      }


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
      expense_id: int, 
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
          Expense.id == expense_id,
          Expense.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
          Expense.id == expense_id,
          Expense.user_id == current_user.id
    ).first()
    if expense is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )
    
    expense.description = expense_data.description
    expense.amount = expense_data.amount
    expense.category = expense_data.category
    expense.date = expense_data.date

    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
          Expense.id == expense_id,
          Expense.user_id == current_user.id
    ).first()
    if expense is None:
                raise HTTPException(
                    status_code=404,
                    detail="Expense not found"
                )
    db.delete(expense)
    db.commit()

    return{
         "message": "Expense deleted succesfully"
    }

