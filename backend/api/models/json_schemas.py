# models/schemas.py
'''
Esquemas de SQLModel para definir los esquemas para interactuar con la base de datos (SQLModel)
'''

from sqlalchemy import false
from sqlmodel import SQLModel
from typing import Optional
from datetime import date, datetime

#Schema para obtención de todos los datos del usuario
class schemaUser(SQLModel):
    id: int
    email: str
    nombre: str
    roles: Optional[str] = None
    puntuacion: Optional[int] = 0
    movil: Optional[int] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

#Schema para actualizar la info de perfil de los usuarios.
class schemaUpdateUserData(SQLModel):
    newBio: Optional[str] = None
    newPhone: Optional[int] = None
    newTwitter:Optional[str] = None
    newFacebook:Optional[str] = None
    newInstagram:Optional[str] = None

#Schema para crear nuevos usuarios
class schemaUserInsert(SQLModel):
    email: str
    nombre: str
    password: str

#Schema para formulario de login
class schemaUserLoginForm(SQLModel):
    username: str
    password: str

#Schema para actualizar los récord de Tetris
class schemaUserTetrisHighScore(SQLModel):
    nombre: str
    puntuacion: int


#Schema para la obtención de archivos.
class schemaFiles(SQLModel):
    id: int
    description: Optional[str] = None
    path: str
    size: int
    date: datetime
    type:str

class TokenData(SQLModel):
    username: str | None = None
    id: int


class schemaLoginList(SQLModel):
    id: int
    user_id: int
    day: date
    inicio_sesion: str
    fin_sesion: Optional[str]
    sesion_ok: Optional[bool]=false
 

   

