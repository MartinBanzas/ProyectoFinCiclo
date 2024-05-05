# database/db.py
'''
Configuración de la base de datos. \n
Se utiliza SQLAlchemy para la conexión con la base de datos en remoto y SQLite para la conexión local.
'''
# Librerías
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
import os

mockup = True

if mockup:

    sqlite_file_name = "database/DriveMartin.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

else:
    user_name = os.environ.get('username')
    password = os.environ.get('password')
    host = os.environ.get('servername')
    database_name = os.environ.get('databasename')

    DATABASE_URI = f"postgresql+psycopg2://{user_name}:{password}@{host}:5432/{database_name}"

    engine = create_engine(
        DATABASE_URI,
        echo=True,
        poolclass=QueuePool,
        pool_pre_ping=True,
        pool_recycle=3600
    )
    
Base = declarative_base()

Session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def create_db_and_tables():
    Base.metadata.create_all(engine)

def get_session_context():
    session = Session()
    try:
        yield session
    finally:
        session.close()
