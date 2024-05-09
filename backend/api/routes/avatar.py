import datetime
import imghdr
import mimetypes
from fastapi import APIRouter, Depends, HTTPException, Security, Request, UploadFile
from fastapi.responses import ORJSONResponse, FileResponse
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaFiles, schemaUser
from models.database_models import File, User
import os

router = APIRouter(
    tags=["Avatar"],
    default_response_class=ORJSONResponse
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

#Subida de Avatares 
@router.post("/drive/avatar/{id}",
             description="Sube un archivo al almacenamiento local y lo anota en la BD",
             response_model=list[schemaFiles])
async def upload_avatar(
        id: int,
        file: UploadFile,
        db: Session = Depends(get_session_context)
):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        user_db = db.query(User).filter(User.id == id).first()
        user_db.avatar = file.filename
        db.add(user_db)
        db.commit()
        
        return ORJSONResponse(content={"filename": user_db.avatar, "saved_path": file_path})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subiendo el archivo: {str(e)}")
    
#Obtención de avatares
@router.get("/drive/get/avatar/{id}",
            description="Obtiene el avatar del usuario",
            response_model=schemaFiles)
async def get_avatar(
        id: int,
        db: Session = Depends(get_session_context)
):
    try:
        user_db = db.query(User).filter(User.id == id).first()
        if user_db.avatar:
            avatar = os.path.join(UPLOAD_DIR, user_db.avatar)  
        return FileResponse(path=avatar, filename=user_db.avatar)

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"No se ha encontrado el archivo {str(e)}")