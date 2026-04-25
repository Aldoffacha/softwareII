from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.db_models import Rol, Usuario
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    @staticmethod
    def login(db: Session, data: LoginRequest) -> str:
        user = db.query(Usuario).filter(Usuario.email == data.email).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")

        role = db.get(Rol, user.rol_id)
        role_name = role.nombre if role else "PUBLICO"

        user.ultimo_login = datetime.now(timezone.utc)
        db.add(user)
        db.commit()

        return create_access_token(subject=str(user.id), role=role_name)

    @staticmethod
    def register(db: Session, data: RegisterRequest) -> Usuario:
        exists = db.query(Usuario).filter(Usuario.email == data.email).first()
        if exists:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya esta registrado")

        role = db.get(Rol, data.rol_id)
        if role is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")

        user = Usuario(
            nombre=data.nombre,
            apellido=data.apellido,
            email=data.email,
            password_hash=get_password_hash(data.password),
            rol_id=data.rol_id,
            activo=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
