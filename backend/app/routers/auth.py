from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import AuthenticatedUser, get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService


router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    token = AuthService.login(db, data)
    return TokenResponse(access_token=token)


@router.post("/register", response_model=UserResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)) -> UserResponse:
    user = AuthService.register(db, data)
    return UserResponse.model_validate(user)


@router.get("/me", response_model=UserResponse)
def me(current: AuthenticatedUser = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current.user)
