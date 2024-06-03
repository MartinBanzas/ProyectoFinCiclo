from datetime import datetime, timedelta, timezone

import os
from jose import jwt
from passlib.context import CryptContext


SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
REFRESH_TOKEN_EXPIRES_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_token(*, data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": int(expire.timestamp() * 1000)})  # Hay que multiplicar por 1000 para desplazar la coma 3 cifras a la derecha
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")  # Solo dos argumentos aquí
    return encoded_jwt