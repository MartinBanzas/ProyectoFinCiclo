# routes/libros.py

# Librerías

import os
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.responses import ORJSONResponse
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaLibro
from models.database_models import Libro
from typing import Any, Dict
from utils.azure_config import azure_scheme, get_user_from_azure_token


router = APIRouter(
    tags=["Libros"],
    dependencies=[Security(azure_scheme)],
    default_response_class=ORJSONResponse
)

description = """
![Logo del endpoint](http://localhost:5000/static/img/imagenflor.ico)
<br></br>
Obtiene todos los libros del usuario autenticado. No usa Scopes.
"""

@router.get("/libros", 
            description=description,
            response_model=list[schemaLibro])


async def obtener_libros(
    token_data: Dict[str, Any] = Depends(get_user_from_azure_token),
    db: Session = Depends(get_session_context)
):
  
    '''
    Obtiene todos los libros de un usuario
    '''
    # Get de todos los libros de acuerdo al usuario cuya información está en el token
    # Si se especifica id
    if not any(env_var in token_data['emails'] for env_var in [os.getenv('BASIC'), os.getenv('ADMIN'), os.getenv('PREMIUM')]):
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este recurso")
    else:  
        libros = db.query(Libro).filter(Libro.username == token_data['username']).all()

    return libros