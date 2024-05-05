# test/test_routes.py
# Author: kifirifis
# Description: Test routes for the API

from fastapi.testclient import TestClient
from main import app
import os

API_KEY = os.environ.get('API_KEY')
usernameAdmin = os.environ.get('usernameAdmin')
passhashAdmin = os.environ.get('passhashAdmin')

client = TestClient(app)


def authenticate_client():
    auth_response = client.post("/token", data={"username": usernameAdmin, "password": passhashAdmin})
    token = auth_response.json().get("access_token")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    return headers

def test_get_libros():
    headers = authenticate_client()
    response = client.get(f"/libros?api_key={API_KEY}", headers=headers)
    assert response.status_code == 200 or response.status_code == 401

def test_get_peliculasSeries():
    headers = authenticate_client()
    response = client.get(f"/peliculasSeries?api_key={API_KEY}", headers=headers)
    assert response.status_code == 200 or response.status_code == 401
