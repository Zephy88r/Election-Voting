@echo off
echo Starting Nepal Election System...
echo.

echo Starting Django backend server...
cd "Vot\voting_system"
start "Django Backend" cmd /k "python manage.py runserver 127.0.0.1:8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React frontend server...
cd ..\..\
start "React Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul