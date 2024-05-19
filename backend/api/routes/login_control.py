from fastapi import APIRouter, Depends, HTTPException, Security, Request
from fastapi.responses import ORJSONResponse, Response
from datetime import date, datetime, timedelta
from sqlalchemy.orm import joinedload
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaLoginList
from models.database_models import LoginControl, User
from slowapi import Limiter
from slowapi.util import get_remote_address



router = APIRouter(
    tags=["LoginControl"],
    default_response_class=ORJSONResponse
)

@router.post("/inicio_sesion/{id}", description="Añade a la DB el horario original de logeado", response_model=str)
async def inicio_sesion(
    id:int,
    db:Session = Depends(get_session_context)
) -> str:
    try:
        user_db = db.query(User).filter(User.id == id).first()
        today = date.today()
        now = datetime.now()

        login = db.query(LoginControl).filter(LoginControl.user_id == user_db.id, LoginControl.day == today).first()
        
        if login:
            raise HTTPException(status_code=400, detail="Ya iniciaste sesión")
        else:
            new_login = LoginControl()
            new_login.day = today
            new_login.user_id = user_db.id
            new_login.inicio_sesion = now.strftime("%H:%M:%S")  # Guardar solo la hora
            db.add(new_login)
            db.commit()
        return f"Te has logeado correctamente el {today} a las {now.strftime('%H:%M:%S')}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logéandote {e}")



@router.get("/get_all_logs", description="Obtiene todos los registros de login", response_model=list[schemaLoginList])
async def get_all_logs(
    db: Session = Depends(get_session_context)
):
    try:
       
        #Es una query en la que queremos sacar el nombre de la persona así que hay que hacer Join
        full_login_list = db.query(LoginControl).options(joinedload(LoginControl.user)).all()
        
        if not full_login_list:
            raise HTTPException(status_code=404, detail="No se encontraron registros de login")
        result = [
            schemaLoginList(
                id=login.id,
                user_id=login.user_id,
                day=login.day,
                inicio_sesion=login.inicio_sesion,
                fin_sesion=login.fin_sesion,
                sesion_ok=login.sesion_ok,
                user_name=login.user.nombre
            )
            for login in full_login_list
        ]

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error {e}")



@router.get("/get_logs_by_user/{user_id}", description="Obtiene los registros de cada usuario original de login", response_model=list[schemaLoginList])
async def get_logs_by_user(
    user_id:int,
    db:Session = Depends(get_session_context)
):
    try:
        user_login_list=db.query(LoginControl).filter(LoginControl.user_id==user_id).all()
        if not user_login_list:
          raise HTTPException(status_code=404, detail="Usuario y login inicial no encontrado")
        return user_login_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error {e}")
    

@router.post("/fin_sesion/{id}", description="Añade a la DB el horario de fin del logeado", response_model=str)
async def end_log(
    id: int,
    db: Session = Depends(get_session_context)
) -> str:
    try:
        today = date.today()
        now = datetime.now()

        login = db.query(LoginControl).filter(LoginControl.user_id == id, LoginControl.day == today).first()

        if not login:
            raise HTTPException(status_code=400, detail="No iniciaste sesión, no puedes cerrarla sin logearte primero")
        if login.fin_sesion:
            raise HTTPException(status_code=400, detail="Ya cerraste la sesión")
        else:
            #Convertimos los string de vuelta a fechas para efectuar la comparación horaria.
            login.fin_sesion = now.strftime("%H:%M:%S")  
            inicio_sesion = datetime.strptime(login.inicio_sesion, "%H:%M:%S")
            fin_sesion_ = datetime.strptime(login.fin_sesion, "%H:%M:%S")
            time_difference = fin_sesion_ - inicio_sesion
            if (time_difference > timedelta(hours=8)):
                login.sesion_ok=True
            else:
                login.sesion_ok=False
          
            db.commit()
            return f"Has cerrado la sesión correctamente el {today} a las {now.strftime('%H:%M:%S')}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cerrando la sesión {e}")