Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Iniciando BandHub con Docker Compose   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Retornar a la raíz del proyecto si el script se ejecuta desde la carpeta scripts
$rootDir = Split-Path -Path $PSScriptRoot -Parent
if (-not $rootDir) { $rootDir = "." }

Set-Location $rootDir

Write-Host "Construyendo y levantando contenedores (DB, Redis, MinIO, Backend, Frontend)..." -ForegroundColor Yellow
docker compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBandHub iniciado con exito!" -ForegroundColor Green
    Write-Host " - Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host " - Backend API: http://localhost:8080" -ForegroundColor Cyan
    Write-Host " - MinIO Console: http://localhost:9001 (User: bandhub_admin / Pass: bandhub_minio_password)" -ForegroundColor Cyan
    Write-Host " - PostgreSQL: localhost:5432 (DB: bandhub_db / User: bandhub_user)" -ForegroundColor Cyan
    Write-Host " - Redis: localhost:6379`n" -ForegroundColor Cyan
    Write-Host "Para ver logs en tiempo real ejecuta: docker compose logs -f" -ForegroundColor Yellow
    Write-Host "Para detener el entorno ejecuta: docker compose down" -ForegroundColor Yellow
} else {
    Write-Host "`nError al levantar los contenedores. Verifica que Docker Desktop este ejecutandose." -ForegroundColor Red
}
