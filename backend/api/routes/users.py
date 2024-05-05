
from fastapi import APIRouter, Depends, HTTPException, Security, Request
from fastapi.responses import ORJSONResponse, Response
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaUser, schemaUserInsert, schemaUserTetrisHighScore, schemaUserLoginForm
from models.database_models import User
from slowapi import Limiter
from slowapi.util import get_remote_address
import bcrypt
from utils.security import verify_password, create_token

router = APIRouter(
    tags=["Users"],
    default_response_class=ORJSONResponse
)

description = """
![Logo del endpoint]()
<br></br>
Obtains all users.
"""

@router.post("/auth/loginUser",
            description="Autentica al usuario y genera un token",
             response_model=schemaUser)
async def authenticate_user(
        user_login_form: schemaUserLoginForm,
        db: Session = Depends(get_session_context)
):
    #
    user_db = db.query(User).filter(User.email==user_login_form.username).first()  #Busca el usuario por email.

    if not user_db:
           raise HTTPException(status_code=404, detail="No se ha encontrado el email")

    if verify_password(user_login_form.password, user_db.password):
        data_for_token = {"id":user_db.id, "username": user_db.email, }
        token = create_token(data=data_for_token)
        print(token)
        return user_db
    else:
        raise HTTPException(status_code=403, detail="Usuario o contraseña no coinciden")
       


@router.get("/auth/get_users",
            description="Obtiene todos los usuarios de la BD",
            response_model=list[schemaUser])
async def get_users(
        db: Session = Depends(get_session_context)
):
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No hay datos en la tabla")
    return users

#Busca un usuario pasando un id
@router.get("/auth/get_users_by_id/{id}",
            description="Busca un usuario pasando un ID",
            response_model=list[schemaUser])
async def get_users(
        id:int,
        request: Request,
        db: Session = Depends(get_session_context)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="No hay datos en la tabla")
    return user


#Maximum of 5 requests/min for an IP address
limiter = Limiter(key_func=get_remote_address)

@limiter.limit("5/minute")
@router.patch("/auth/updateUserData/{id}", response_model=schemaUser,
              description='Actualiza un usuario pasando un ID')
async def update_user(
        request: Request,
        id: int,
        newPhone: int,
        newBio: str,
        newEmail: str,
        db: Session = Depends(get_session_context)):

    user_db = db.query(User).filter(User.id == id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="No se ha encontrado al usuario")

    user_db.phone = newPhone
    user_db.email = newEmail
    user_db.bio = newBio

    db.add(user_db)
    db.commit()
    db.refresh(user_db)
    return user_db


@router.post("/auth/addUser", response_model=schemaUserInsert, description='Crea un usuario en la BD')
async def addUser(user_insert: schemaUserInsert,
                  db: Session = Depends(get_session_context)):

    #Hay que convertir el JSON recibido a un objeto User para insertarlo en SQL
    user_dic = user_insert.model_dump()
    user_db = db.query(User).filter(User.email == user_insert.email).first() #Comprueba si ya existe el email en la BD
    if user_db:
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    newUser = User(**user_dic)
    password = newUser.password
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash=bcrypt.hashpw(bytes, salt)
    newUser.password=hash

    db.add(newUser)
    db.commit()

    return ORJSONResponse(
            status_code=200,
            content={'mensaje':f'¡Usuario {newUser.nombre} creado correctamente!'}
        )


@router.patch("/tetris/highScore", response_model=schemaUserInsert, description='Adds user to DB.')
async def addUser(tetris_score: schemaUserTetrisHighScore,
                  db: Session = Depends(get_session_context)):
    user_db = db.query(User).filter(User.nombre == tetris_score.nombre).first()
    user_db.puntuacion=tetris_score.puntuacion
    db.add(user_db)
    db.commit()
    db.refresh(user_db)
    return user_db
