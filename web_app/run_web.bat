@echo off
title Chrome Dino Runner - Web
cd /d "%~dp0"
echo Instalando dependencias...
python -m pip install -r requirements.txt
echo.
echo Iniciando servidor en http://localhost:5000
echo Pulsa CTRL+C para detenerlo.
echo.
python app.py
pause
