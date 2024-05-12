
from fastapi import APIRouter, Depends, HTTPException, Security, Request
from fastapi.responses import ORJSONResponse, Response
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaUpdateUserData, schemaUser, schemaUserInsert, schemaUserTetrisHighScore, schemaUserLoginForm
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

@router.post("/login", description="Autentica al usuario y genera un token", response_model=str)
async def authenticate_user(
    user_login_form: schemaUserLoginForm,
    db: Session = Depends(get_session_context)
) -> str:
    user_db = db.query(User).filter(User.email == user_login_form.username).first()

    if not user_db:
        raise HTTPException(status_code=404, detail="No se ha encontrado el email")

    if verify_password(user_login_form.password, user_db.password):
        data_for_token = {"id": user_db.id, "username": user_db.email, "nombre":user_db.nombre, "roles":user_db.roles}
        token = create_token(data=data_for_token)
        
        return  token 
    else:
        raise HTTPException(status_code=403, detail="Usuario o contraseña no coinciden")


@router.get("/get_users",
            description="Obtiene todos los usuarios de la BD",
            response_model=list[schemaUser])
async def get_users(
        db: Session = Depends(get_session_context)
) -> dict:
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No hay datos en la tabla")
    return users

#Busca un usuario pasando un id
@router.get("/get_users_by_id/{id}",
            description="Busca un usuario pasando un ID",
            response_model=schemaUser)
async def get_users(
        id:int,
        request: Request,
        db: Session = Depends(get_session_context)
) -> dict:
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="No hay datos en la tabla")
    return user


#5 solicitudes/min máximo por dirección ip.
limiter = Limiter(key_func=get_remote_address)

@limiter.limit("5/minute")
@router.patch("/auth/updateUserData/{id}", response_model=schemaUser, description='Actualiza un usuario pasando un ID')
async def update_user(
        request: Request,
        id: int,
        new_user_data: schemaUpdateUserData,
        db: Session = Depends(get_session_context)):

    user_db = db.query(User).filter(User.id == id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="No se ha encontrado al usuario")

    # Verificar que cada campo no esté vacío antes de actualizarlo
    if new_user_data.newPhone is not None:
        user_db.movil = new_user_data.newPhone
    if new_user_data.newBio is not None:
        user_db.bio = new_user_data.newBio
    if new_user_data.newFacebook is not None:
        user_db.facebook = new_user_data.newFacebook
    if new_user_data.newInstagram is not None:
        user_db.instagram = new_user_data.newInstagram
    if new_user_data.newTwitter is not None:
        user_db.twitter = new_user_data.newTwitter

    db.add(user_db)
    db.commit()
    db.refresh(user_db)
    return user_db



@router.post("/addUser", response_model=schemaUserInsert, description='Crea un usuario en la BD')
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


@router.patch("/tetris/highScore", response_model=schemaUserTetrisHighScore, description='Adds user to DB.')
async def addUser(tetris_score: schemaUserTetrisHighScore,
                  db: Session = Depends(get_session_context)):
    
    user_db = db.query(User).filter(User.nombre == tetris_score.nombre).first()
    user_db.puntuacion=tetris_score.puntuacion
    db.add(user_db)
    db.commit()
    db.refresh(user_db)
    return user_db


@router.delete("/delete_user/{id}", description='Borra un usuario en la BD. Solo para propósitos de dev.')
async def addUser(id:int,
                  db: Session = Depends(get_session_context)):

    user_db=db.query(User).filter(User.id==id).first()
    db.delete(user_db)
    db.commit()

    return ORJSONResponse(
            status_code=200,
            content={'mensaje':f'¡Usuario borrado correctamente!'}
        )
