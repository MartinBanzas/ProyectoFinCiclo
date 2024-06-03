#!/bin/bash
set -e
echo "Iniciando ssh......................"
service ssh start
echo 'Iniciando uvicorn api-martin............'
exec uvicorn main:app --reload --host 0.0.0.0 --port 80
#Local: 8910. Azure:80