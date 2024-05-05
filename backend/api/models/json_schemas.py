# models/schemas.py
'''
Esquemas de SQLModel para definir los esquemas para interactuar con la base de datos (SQLModel)
'''

from sqlmodel import SQLModel
from typing import List, Optional
from datetime import date, datetime

#======== Libros
class schemaLibro(SQLModel):
    username: str
    titulo: str
    autor: str
    genero: str
    calificacion: float | None = None
    comentario: str | None = None


#======== Películas y series
class schemaPeliculaSerie(SQLModel):
    username: str
    titulo: str
    director: str
    genero: str
    calificacion: float | None = None
    comentario: str | None = None


#======== Libros, peliculas y series

class schemaLibroPeliculaSerie(SQLModel):
    libros: List[schemaLibro]
    peliculasseries: List[schemaPeliculaSerie]


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


#Schema para crear nuevos usuarios
class schemaUserInsert(SQLModel):
    email: str
    nombre: str
    password: str

class schemaUserLoginForm(SQLModel):
    username: str
    password: str

#Schema para los récord de Tetris
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
