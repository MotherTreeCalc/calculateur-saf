@echo off
cd /d "C:\Users\chapm\OneDrive\Bureau\calculateur-saf"

start "Serveur Python" cmd /k "python -m http.server 8000"

:: Attente augmentée pour laisser le serveur s'initialiser
timeout /t 3 >nul

start "" "C:\Program Files\Mozilla Firefox\firefox.exe" http://localhost:8000/index.html
