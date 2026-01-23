@echo off
echo Starting Nepal Election Voting System...
echo.

echo Starting Django Backend...
start "Django Backend" cmd /k "cd voting_system && python manage.py runserver 127.0.0.1:8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "npm run dev"

echo.
echo Both services are starting...
echo Frontend: http://localhost:5173
echo Backend: http://127.0.0.1:8000
echo.
pause