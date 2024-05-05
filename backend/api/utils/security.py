from datetime import datetime, timedelta, timezone

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, SecurityScopes, APIKeyQuery, APIKeyHeader
import os
from jose import jwt, JWTError
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
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, "ajksdhfksajhasdhj", algorithm="HS256")
    return encoded_jwt