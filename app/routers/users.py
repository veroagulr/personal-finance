from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, VerifyAccount, LoginRequest
from app.security import (
    hash_password, verify_password, create_acces_token, get_current_user)

import random
from datetime import datetime, timedelta

router = APIRouter(
    prefix = "/users",
    tags = ["Users"]
)

@router.post("", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    verification_code = str(
        random.randint(100000, 999999)
    )

    new_user = User(
        username = user.username,
        email = user.email,
        password = hash_password(user.password),
        is_verified = False,
        verification_code = verification_code,
        verification_expires = datetime.utcnow() + timedelta(minutes=10)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print(
        f"Codigo de verificacion para {user.email}: "
        f"{verification_code}"
    )

    return new_user

@router.post("/verify")
def verify_account(
    data: VerifyAccount,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Account already verified"
        )

    if user.verification_code != data.code:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code"
        )

    if (
        user.verification_expires is None
        or datetime.utcnow() > user.verification_expires
    ):
        raise HTTPException(
            status_code=400,
            detail="Verification code expired"
        )

    user.is_verified = True
    user.verification_code = None
    user.verification_expires = None

    db.commit()

    return {
        "message": "Account verified successfully"
    }

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
): 
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        user.password
    ):
        raise HTTPException(
            status_code=403,
            detail="Account not verified"
        )
    access_token = create_acces_token({
        "sub": str(user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }