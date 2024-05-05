#!/bin/bash
set -e
echo "Iniciando ssh......................"
service ssh start
echo 'Iniciando uvicorn api-kifirifis............'
exec uvicorn main:app --reload --host 0.0.0.0 --port 8910