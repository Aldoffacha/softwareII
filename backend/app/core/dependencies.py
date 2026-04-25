import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.db_models import Rol, Usuario


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class AuthenticatedUser:
    def __init__(self, user: Usuario, role_name: str):
        self.user = user
        self.role_name = role_name


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> AuthenticatedUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autenticado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.get(Usuario, uuid.UUID(user_id))
    if user is None or not user.activo:
        raise credentials_exception

    role = db.get(Rol, user.rol_id)
    role_name = role.nombre if role else "PUBLICO"

    return AuthenticatedUser(user=user, role_name=role_name)


def require_roles(*allowed_roles: str):
    def role_dependency(current: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if current.role_name not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")
        return current

    return role_dependency
