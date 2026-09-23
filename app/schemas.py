#se encarga de los datos que recibe la api
from datetime import date
from pydantic import BaseModel, Field, EmailStr, field_validator

class ExpenseCreate(BaseModel):
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=100)
    date: date

class ExpenseUpdate(BaseModel):
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=100)
    date: date

class ExpenseResponse(BaseModel):
    id: int
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: str = Field(min_length=1, max_length=100)
    date: date

class IncomeCreate(BaseModel):
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    source: str = Field(min_length=1, max_length=50)
    date: date

class IncomeUpdate(BaseModel):
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    source: str = Field(min_length=1, max_length=50)
    date: date

class IncomeResponse(BaseModel):
    id: int
    description: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    source: str = Field(min_length=1, max_length=100)
    date: date

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    @field_validator("email")
    @classmethod 
    def validate_email_domain(cls, value: EmailStr):
        allowed_domains = {
            "gmail.com",
            "outlook.com",
            "hotmail.com"
        }

        domain = value.split("@")[1].lower()
        if domain not in allowed_domains:
            raise ValueError(
                "Email domain is not allowed"
            )
        return value
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter"
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter"
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one number"
            )

        special_characters = "!@#$%^&*()-_=+[]{};:,.?/"

        if not any(char in special_characters for char in value):
            raise ValueError(
                "Password must contain at least one special character"
            )

        return value

class UserResponse(BaseModel):
    id: int
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=100)

class VerifyAccount(BaseModel):
    email: EmailStr
    code: str = Field(
        min_length= 6,
        max_length= 6
    )

class LoginRequest(BaseModel):
    email: EmailStr
    password: str