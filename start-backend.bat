@echo off
echo Starting Nepal Election Backend...
echo.

echo Step 1: Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Running Django migrations...
cd "Vot\voting_system"
python manage.py migrate
if %errorlevel% neq 0 (
    echo Error: Failed to run migrations
    pause
    exit /b 1
)

echo.
echo Step 3: Loading initial data...
python manage.py load_initial_data
if %errorlevel% neq 0 (
    echo Warning: Failed to load initial data (this might be normal if already loaded)
)

echo.
echo Step 4: Starting Django server...
echo Backend will be available at: http://127.0.0.1:8000
echo.
python manage.py runserver 127.0.0.1:8000