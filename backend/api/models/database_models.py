# models/models.py
'''
Esquemas de sqlalchemy para definir las tablas de la base de datos e interactuar con ellas (SQLAlchemy)
'''
# Librerías
from sqlalchemy import (
    Column, Integer, String, 
    Float, UniqueConstraint, Text, Date
)
from database.db import Base

#========== Libros de cada usuario
class Libro(Base):
    __tablename__ = 'Libro'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    titulo = Column(String(255), nullable=False)
    autor = Column(String(255), nullable=False)
    genero = Column(String(255), nullable=False)
    calificacion = Column(Float, nullable=True)
    comentario = Column(String(255), nullable=True)

    __table_args__ = (UniqueConstraint('username', 'titulo'),)

#========== Películas y series de cada usuario
class PeliculaSerie(Base):
    __tablename__ = 'PeliculaSerie'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    titulo = Column(String(255), nullable=False)
    director = Column(String(255), nullable=False)
    genero = Column(String(255), nullable=False)
    calificacion = Column(Float, nullable=True)
    comentario = Column(String(255), nullable=True)

    __table_args__ = (UniqueConstraint('username', 'titulo'),)

class User(Base):
    __tablename__= 'User'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    roles = Column(String(255), nullable=True)
    password = Column(String(255), nullable=False)
    nombre = Column(String(255), nullable=False)
    puntuacion  = Column(Integer, nullable=True)
    movil  = Column(Integer, nullable=True)
    twitter = Column(String(255), nullable=True)
    facebook = Column(String(255), nullable=True)
    instagram = Column(String(255), nullable=True)
    bio = Column(Text(255), nullable=True)
    avatar = Column(String(255), nullable=True)

    __table_args__ = (UniqueConstraint('email', 'movil'),)


class File(Base):
    __tablename__='File'

    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(255), nullable=True)
    path = Column(String(255), nullable=False)
    size = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    type = Column(String(255), nullable=False)