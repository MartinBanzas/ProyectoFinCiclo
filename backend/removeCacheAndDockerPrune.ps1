$targetPath = "$PSScriptRoot\api"

Get-ChildItem -Path $targetPath -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path $targetPath -Recurse -Directory -Filter ".pytest_cache" | Remove-Item -Recurse -Force

docker system prune -f