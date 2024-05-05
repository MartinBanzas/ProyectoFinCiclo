# utils/azure_config.py
'''
Configura la autenticación con Azure AD B2C
'''

from typing import Annotated, Dict, Any
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi_azure_auth import B2CMultiTenantAuthorizationCodeBearer
from fastapi import Security, HTTPException, APIRouter, Depends
from fastapi.security import APIKeyQuery, APIKeyHeader
import os

class AzureSettings(BaseSettings):
    
    TENANT_NAME: str = ""
    APP_CLIENT_ID: str = ""
    OPENAPI_CLIENT_ID: str = ""
    AUTH_POLICY_NAME: str = ""
   
    @computed_field
    @property
    def SCOPE_NAME(self) -> str:
        return f'https://{self.TENANT_NAME}.onmicrosoft.com/{self.APP_CLIENT_ID}'

    @computed_field
    @property
    def SCOPES(self) -> dict:
        return {
             f'{self.SCOPE_NAME}/main': "Solo es necesario un scope" 
        }

    @computed_field
    @property
    def OPENID_CONFIG_URL(self) -> dict:
        return f'https://{self.TENANT_NAME}.b2clogin.com/{self.TENANT_NAME}.onmicrosoft.com/{self.AUTH_POLICY_NAME}/v2.0/.well-known/openid-configuration'

    @computed_field
    @property
    def OPENAPI_AUTHORIZATION_URL(self) -> dict:
        return f'https://{azure_settings.TENANT_NAME}.b2clogin.com/{azure_settings.TENANT_NAME}.onmicrosoft.com/{azure_settings.AUTH_POLICY_NAME}/oauth2/v2.0/authorize'

    @computed_field
    @property
    def OPENAPI_TOKEN_URL(self) -> dict:
        return f'https://{azure_settings.TENANT_NAME}.b2clogin.com/{azure_settings.TENANT_NAME}.onmicrosoft.com/{azure_settings.AUTH_POLICY_NAME}/oauth2/v2.0/token'

    model_config = SettingsConfigDict(
        extra='allow',
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

azure_settings = AzureSettings()

#Creamos un objeto AzureSettings y se lo pasamos como esquema a la clase estática
#B2CMultiTenantAuthorizationCodeBearer que nos proporciona la librería fastapi-azure-auth
#Esta es la que verdaderamente realiza la autenticación, AzureSettings solo configura
#nuestras rutas de Azure.
azure_scheme = B2CMultiTenantAuthorizationCodeBearer(
    app_client_id=azure_settings.APP_CLIENT_ID,
    openid_config_url=azure_settings.OPENID_CONFIG_URL,
    openapi_authorization_url=azure_settings.OPENAPI_AUTHORIZATION_URL,
    openapi_token_url=azure_settings.OPENAPI_TOKEN_URL,
    scopes=azure_settings.SCOPES,
    validate_iss=False,
)

#Obtención de los campos que nos interesan del token de Azure
#Esto probablemente debería ir en security ya que ahí se extraen los campos de los token OAuth2 que se usaban antes
#Pero así es más claro de momento.
async def get_user_from_azure_token(token: str = Security(azure_scheme)):
    
    return {
        "scopes": token.scp,
        "emails": token.claims['emails'],
        "family_name": token.family_name,
        "username": token.given_name
    }

async def get_current_active_user(current_user: Annotated[Dict[str, Any], Security(azure_scheme)]):
    return current_user
        
router = APIRouter(
    tags=["Seguridad y Autenticación"],
    include_in_schema=True
)

#=============================  Protege /docs y /redoc con api_key
API_KEY = os.getenv("API_KEY")
X_API_KEY = os.getenv("X_API_KEY")

api_key_query = APIKeyQuery(name="api_key", 
                            auto_error=False, 
                            description='API Key para acceder a todos los endpoints de la API.')
api_key_header = APIKeyHeader(name="X-API-Key", 
                              auto_error=False,
                              description='API Key HEADER para acceder a todos los endpoints de la API.')

def get_api_key(api_key: str = Security(api_key_query)) -> str:
    if api_key == API_KEY:
        return api_key
    
    raise HTTPException(status_code=401, detail="API Key incorrecta")

def get_api_key_header(api_key: str = Security(api_key_header)) -> str:
    if api_key == X_API_KEY:
        return api_key


async def read_users_me(
    current_user: Dict[str, Any] = Depends(get_user_from_azure_token),
):
    usuario_activo = current_user
    
    return usuario_activo

@router.get("/users/me/",
            description='Devuelve información del usuario actual')
async def quien_soy(
    current_user: Dict[str, Any] = Depends(get_user_from_azure_token),
):
    return current_user