import datetime
import os

from fastapi import APIRouter, Depends, HTTPException, Security, Request, UploadFile
from fastapi.responses import ORJSONResponse, FileResponse
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaFiles, schemaUser
from models.database_models import File, User
import mimetypes, imghdr

router = APIRouter(
    tags=["Files"],
    default_response_class=ORJSONResponse
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


#Devuelve un JSON con todos los archivos
@router.get("/drive/files",
            description="Obtiene un JSON con todos los archivos",
            response_model=list[schemaFiles])
async def get_files(
        db: Session = Depends(get_session_context)
):

    files = db.query(File).all()
    if not files:
        raise HTTPException(status_code=404, detail="No hay datos en la tabla")
    return files


#Descarga de fichero. Retorna el propio archivo.
@router.get("/drive/get/{id}",
            description="Encuentra el archivo en el almacenamiento local y lo descarga",
            response_model=schemaFiles)
async def get_file_by_id(
        id: int,
        db: Session = Depends(get_session_context)
):
    file = db.query(File).filter(File.id == id).first()
    if file is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    file_for_download = os.path.join(UPLOAD_DIR, file.path)
    return FileResponse(path=file_for_download, filename=file.path)


#Subida de archivo
@router.post("/drive/new/upload",
             description="Sube un archivo al almacenamiento local y lo anota en la BD",
             response_model=list[schemaFiles])
async def upload_file(
        file: UploadFile,
        db: Session = Depends(get_session_context)
):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Obtiene el tamaño del fichero
        file.file.seek(0, os.SEEK_END)  # Busca el final del fichero
        file_size = file.file.tell()  # Obtiene la posición del puntero

        # Crea registro del fichero en la BD
        newFile = File()
        newFile.size = file_size
        newFile.path = file.filename
        newFile.date = datetime.datetime.now()
        mime_type, _ = mimetypes.guess_type(file_path)
        newFile.type=mime_type
        db.add(newFile)
        db.commit()
        return ORJSONResponse(content={"filename": file.filename, "saved_path": file.path})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subiendo el archivo: {str(e)}")




@router.patch("/drive/rename/{id}", description="Renombra un fichero y actualiza el registro")
async def rename_file(
        new_name: str,
        id: int,
        db: Session = Depends(get_session_context)
):
    try:
        file_db = db.query(File).filter(File.id == id).first()
        if not file_db:
            raise HTTPException(status_code=404, detail="Archivo no encontrado")

        # Prepara las rutas del archivo antiguo y el nuevo
        file_old_path = os.path.join(UPLOAD_DIR, file_db.path)
        file_new_path = os.path.join(UPLOAD_DIR, new_name)

        # Renombra el archivo en el sistema de archivos
        os.rename(file_old_path, file_new_path)

        # Actualiza el nombre del archivo en el registro de la base de datos
        file_db.path = new_name
        db.commit()

        return ORJSONResponse(content={"message": "Archivo renombrado correctamente"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al renombrar el archivo: {str(e)}")



@router.delete("/drive/delete/{id}", description="Renombra un archivo")
async def delete_file(
        id: int,
        db: Session = Depends(get_session_context)
):
    try:
        #Obtiene el registro del archivo en la BD
        file_db = db.query(File).filter(File.id == id).first()
        if not file_db:
            raise HTTPException(status_code=404, detail="Archivo no encontrado")

        #Borra el archivo local
        file_path = os.path.join(UPLOAD_DIR, file_db.path)
        os.remove(file_path)

        #Borra el registro en la BD
        db.delete(file_db)
        db.commit()

        return ORJSONResponse(content={"message": "Archivo eliminado correctamente"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar el archivo: {str(e)}")