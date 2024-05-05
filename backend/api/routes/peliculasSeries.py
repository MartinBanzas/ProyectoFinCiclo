# routes/peliculasSeries.py

# Librerías
import os
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.responses import ORJSONResponse
from database.db import get_session_context
from sqlalchemy.orm import Session
from models.json_schemas import schemaPeliculaSerie
from models.database_models import PeliculaSerie
from typing import Dict, Any

from utils.azure_config import azure_scheme, get_user_from_azure_token

router = APIRouter(
    tags=["Peliculas y Series"],
    dependencies=[Security(azure_scheme)],
    default_response_class=ORJSONResponse
)

description = """
![Logo del endpoint](http://localhost:5000/static/img/calavera.ico)
<br></br>
Obtiene todas las películas y series de un usuario autenticado. Scopes ADMIN
"""

@router.get("/peliculasSeries", 
            description=description,
            response_model=list[schemaPeliculaSerie])
async def obtener_peliculas_series(
    token_data: Dict[str, Any] = Depends(get_user_from_azure_token),
    db: Session = Depends(get_session_context)
):
    print(os.getenv('ADMIN'))
   # print(token_data['emails'])
    '''
    Obtiene todas las películas y series de un usuari
    '''
    if os.getenv('ADMIN') not in token_data['emails']:
            raise HTTPException(status_code=403, detail="No tienes permiso para ver este recurso. ADMIN requerido")
    # Si se tienen los scopes necesarios, obtener las películas y series del usuario
    else:
        peliculasSeries = db.query(PeliculaSerie).filter(PeliculaSerie.username == token_data['username']).all()
    
    return peliculasSeries