from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import date
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Income, User
from app.schemas import IncomeCreate, IncomeResponse, IncomeUpdate
from app.security import get_current_user

router = APIRouter(
    prefix="/incomes",
    tags=["Incomes"]
)

@router.post("", response_model=IncomeResponse)
def create_income(
    income: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_income = Income(
        description = income.description,
        amount = income.amount,
        source = income.source,
        date = income.date,
        user_id = current_user.id
    )

    db.add(new_income)
    db.commit()
    db.refresh(new_income)

    return new_income

@router.get("", response_model=list[IncomeResponse])
def get_incomes(
    source: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Income).filter(
        Income.user_id == current_user.id
    )

    if source:
        query = query.filter(
            Income.source == source
        )

    if start_date:
        query = query.filter(
            Income.date >= start_date
        )

    if end_date:
        query = query.filter(
            Income.date <= end_date
        )

    offset = (page - 1) * limit

    incomes = query.order_by(
        Income.date.desc()
    ).offset(offset).limit(limit).all()

    return incomes

@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id
    ).first()

    if income is None:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    return income

@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income_data: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id
    ).first()

    if income is None:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    income.description = income_data.description
    income.amount = income_data.amount
    income.source = income_data.source
    income.date = income_data.date

    db.commit()
    db.refresh(income)

    return income

@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id
    ).first()

    if income is None:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    db.delete(income)
    db.commit()

    return {
        "message": "Income deleted successfully"
    }