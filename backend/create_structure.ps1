# Crea estructura de archivos y directorios para proyecto en FastAPI
# Crear directorios
$directories = @(
    "./api",
    "./api/database",
    "./api/models",
    "./api/routes",
    "./api/test",
    "./api/utils",
    "./api/static/img",
    "./.github/workflows",
    "./docs"
)

foreach ($directory in $directories) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

# Crear archivos
$files = @(
    "./api/apireadme.md",
    "./api/dockerfile",
    "./api/.dockerignore",
    "./api/pytest.ini",
    "./api/init_container.sh",
    "./api/main.py",
    "./api/requirements.txt",
    "./api/sshd_config",
    "./api/database/db.py",
    "./api/database/__init__.py",
    "./api/database/db_initdata_mockup.py",
    "./api/models/__init__.py",
    "./api/models/models.py",
    "./api/models/schemas.py",
    "./api/routes/__init__.py",
    "./api/routes/libros.py",
    "./api/routes/librosQuery.py",
    "./api/routes/peliculasSeries.py",
    "./api/test/__init__.py",
    "./api/test/test_routes.py",
    "./api/utils/__init__.py",
    "./api/utils/security.py",
    "./.github/workflows/api-security-check.yml",
    "./.github/workflows/api-testing-routes.yml",
    "./docker-compose.yml",
    "./docker-compose-ci.yml",
    "./bandit.yml",
    "./.gitignore",
    "./removeCacheAndDockerPrune.ps1",
    "./ruff.toml"
)

foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}
