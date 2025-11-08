@echo off
REM Script de respaldo automático para Lauren Repostería
REM Uso: Doble click en este archivo antes de hacer cambios importantes

echo ========================================
echo CREANDO RESPALDO DE ARCHIVOS CRITICOS
echo ========================================
echo.

REM Obtener fecha y hora actual
set FECHA=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%
set HORA=%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set HORA=%HORA: =0%
set TIMESTAMP=%FECHA%_%HORA%

REM Crear carpeta de respaldo
set CARPETA_RESPALDO=backups\backup_%TIMESTAMP%
mkdir "%CARPETA_RESPALDO%"

echo Creando respaldo en: %CARPETA_RESPALDO%
echo.

REM Copiar archivos críticos
echo Copiando CSS...
xcopy "css\tortas-styles.css" "%CARPETA_RESPALDO%\css\" /Y /I
xcopy "css\header.css" "%CARPETA_RESPALDO%\css\" /Y /I
xcopy "css\mobile-fixes.css" "%CARPETA_RESPALDO%\css\" /Y /I

echo Copiando JavaScript...
xcopy "js\tortas-script.js" "%CARPETA_RESPALDO%\js\" /Y /I
xcopy "js\tortas-data.js" "%CARPETA_RESPALDO%\js\" /Y /I
xcopy "js\scroll-to-top.js" "%CARPETA_RESPALDO%\js\" /Y /I

echo Copiando HTML...
xcopy "html\tortas.html" "%CARPETA_RESPALDO%\html\" /Y /I

echo.
echo ========================================
echo RESPALDO COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo Ubicacion: %CARPETA_RESPALDO%
echo.

REM Crear un commit en Git
echo Creando commit en Git...
git add .
git commit -m "Respaldo automático creado: %TIMESTAMP%"

echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
