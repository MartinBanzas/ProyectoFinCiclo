# routes/libros.py

# Librerías

import os
from typing import Any, Dict
from fastapi import APIRouter, Depends, Security, Query, HTTPException
from fastapi.responses import ORJSONResponse
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaLibro
from models.database_models import Libro
from utils.azure_config import azure_scheme, get_user_from_azure_token


router = APIRouter(
    tags=["Libros"],
    dependencies=[Security(azure_scheme)],
    default_response_class=ORJSONResponse
)

description = """
![Logo del endpoint](http://localhost:5000/static/img/imagenflor.ico)
<br></br>
Busca entradas por título mediante parámetro de query (requerido) | Scope PREMIUM
"""

@router.get("/librosPorTitulo", 
            description=description,
            response_model=list[schemaLibro])
async def obtener_libros_por_titulo(
    token_data: Dict[str, Any] = Depends(get_user_from_azure_token),
    title: str = Query(..., description='Título del libro a buscar.'),
    db: Session = Depends(get_session_context)
):
    '''
    Obtiene todas las entradas para libros que coincidan parcialmente con el título proporcionado.
    '''
    if not any(env_var in token_data['emails'] for env_var in [os.getenv('ADMIN'), os.getenv('PREMIUM')]):
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este recurso. PREMIUM/ADMIN requerido")
    elif title:
        libros = db.query(Libro).filter(Libro.titulo.like(f"%{title}%"), Libro.username == token_data['username']).all()
    else: #Si title=false es que el parámetro title está vacío.
        raise HTTPException(400, "El parámetro de consulta 'title' no puede estar vacío")
    
    if not libros:
        raise HTTPException(404, "No se encontraron libros con el título proporcionado")
    
    return libros
