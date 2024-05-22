from fastapi import FastAPI, Request, HTTPException
import os
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from database.db import create_db_and_tables, get_session_context
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
import logging
from routes.users import router as user_list
from routes.files import router as file_list
from routes.avatar import router as avatar_router
from routes.login_control import router as login_router




description = """
![Logo de la API](https://mexicocity.cdmx.gob.mx/wp-content/themes/travel-cdmx/src/images/axolotl.svg)
<br></br>
API para proyecto fin de ciclo Martín Antelo Jallas.
"""

limiter = Limiter(key_func=get_remote_address)


app = FastAPI(
    title="API de la aplicación del proyecto de fin de ciclo de Martín Antelo Jallas",
    description=description,
    contact={'email': 'martin.antelo.jallas@gmail.com'}
)


app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Protege /docs y /redoc con api_key
expected_api_key = os.getenv("API_KEY")

# Middleware para verificar la API key en las rutas /docs y /redoc
# @app.middleware("http")
# async def check_api_key(request: Request, call_next):
#     if request.url.path in ["/docs", "/redoc"]:
#         api_key = request.query_params.get("api_key")

#         if not api_key:
#             return JSONResponse(status_code=401, content={"detail": "Para acceder
#             a /docs y /redoc, se requiere una API Key,
#             la cual hay que pasarla como parámetro 'api_key' en la URL. Ejemplo: /docs?api_key=API"})
#         if api_key != expected_api_key:
#             return JSONResponse(status_code=401, content={"detail": "API Key incorrecta."})

#     response = await call_next(request)
#     return response

# Crea base de datos y usuarios por defecto
'''
Si en db.py Mockup es True, se crea una base de datos SQLite en la carpeta database .
Si Mockup es False, se crea una base de datos PostgreSQL en el servidor especificado en las variables de entorno con usuario y contraseña por defecto.
'''
create_db_and_tables()
db = next(get_session_context())
  
    
# Función general de manejo de excepciones 
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Función general de manejo de excepciones
@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "message": f"Unexpected Error: {exc.__class__.__name__}.",
            "description": str(exc)
        }
    )

# Manejo específico de excepciones HTTP
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )

app.include_router(user_list)
app.include_router(file_list)
app.include_router(avatar_router)
app.include_router(login_router)