@echo off
echo ==========================================
echo  Instalando Polla Mundial - Sector las Brisas
echo ==========================================
echo.

cd /d "%~dp0backend"
echo Instalando dependencias del backend...
call npm install
if %errorlevel% neq 0 (
  echo ERROR: No se pudieron instalar las dependencias
  pause
  exit /b 1
)

echo.
echo ==========================================
echo  Instalacion completada exitosamente!
echo ==========================================
echo.
echo Para iniciar el servidor ejecuta:
echo   cd backend
echo   node index.js
echo.
echo Luego en otra ventana ejecuta:
echo   cd backend
echo   node crearAdmin.js
echo.
pause
