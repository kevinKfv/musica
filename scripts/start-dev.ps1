Write-Host "Iniciando entorno de desarrollo de BandHub..." -ForegroundColor Cyan

# 1. Levantar Docker Compose
Write-Host "Levantando servicios en Docker Compose..." -ForegroundColor Yellow
cd ..\docker
docker compose up -d
cd ..

# 2. Iniciar el Backend (en una nueva ventana)
Write-Host "Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\gradlew bootRun"

# 3. Iniciar el Frontend (en la ventana actual)
Write-Host "Iniciando Frontend (Vite)..." -ForegroundColor Yellow
cd frontend
npm run dev
