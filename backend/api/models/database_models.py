# models/models.py
'''
Esquemas de sqlalchemy para definir las tablas de la base de datos e interactuar con ellas (SQLAlchemy)
'''
# Librerías
from sqlalchemy import (
    Boolean, Column, ForeignKey, Integer, String, 
    Float, UniqueConstraint, Text, Date
)
from sqlalchemy.orm import relationship
from database.db import Base



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
    login_controls = relationship("LoginControl", back_populates="user")

    __table_args__ = (UniqueConstraint('email', 'movil'),)


class File(Base):
    __tablename__='File'

    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(255), nullable=True)
    path = Column(String(255), nullable=False)
    size = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    type = Column(String(255), nullable=False)

class LoginControl(Base):
    __tablename__ = "LoginControl"
    id = Column(Integer, primary_key=True, autoincrement=True)
    day = Column(Date, nullable=False)
    inicio_sesion = Column(String(255), nullable=False)
    fin_sesion = Column(String(255), nullable=True)
    sesion_ok = Column(Boolean, nullable=True)
    user_id = Column(Integer, ForeignKey('User.id'), nullable=False)
    user = relationship("User", back_populates="login_controls")
    #SQLite no soporta horas, solo Dates, hay que pasar las horas como string y construirlas
    #como objetos Date en JavaScript en el front.