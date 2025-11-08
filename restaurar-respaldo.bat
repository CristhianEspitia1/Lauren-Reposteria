@echo off
REM Script para restaurar el último respaldo funcional
REM Uso: Doble click si algo se rompe

echo ========================================
echo RESTAURAR ULTIMO RESPALDO
echo ========================================
echo.
echo ADVERTENCIA: Esto sobreescribira los archivos actuales
echo con la ultima version funcional conocida.
echo.
set /p CONFIRMAR="Estas seguro? (S/N): "

if /i "%CONFIRMAR%" NEQ "S" (
    echo Operacion cancelada.
    pause
    exit
)

echo.
echo Buscando ultimo respaldo...

REM Buscar la carpeta de respaldo más reciente
for /f "delims=" %%i in ('dir /b /ad /o-d backups\backup_*') do (
    set ULTIMO_RESPALDO=backups\%%i
    goto :encontrado
)

:encontrado
if "%ULTIMO_RESPALDO%"=="" (
    echo ERROR: No se encontro ningun respaldo.
    echo Restaurando desde C:\LaurenReposteria...

    copy "C:\LaurenReposteria\css\tortas-styles.css" "css\tortas-styles.css" /Y
    copy "C:\LaurenReposteria\js\tortas-script.js" "js\tortas-script.js" /Y
    copy "C:\LaurenReposteria\html\tortas.html" "html\tortas.html" /Y

    echo.
    echo Archivos restaurados desde el respaldo principal.
    pause
    exit
)

echo Ultimo respaldo encontrado: %ULTIMO_RESPALDO%
echo.

REM Restaurar archivos
echo Restaurando CSS...
copy "%ULTIMO_RESPALDO%\css\tortas-styles.css" "css\tortas-styles.css" /Y
copy "%ULTIMO_RESPALDO%\css\header.css" "css\header.css" /Y
copy "%ULTIMO_RESPALDO%\css\mobile-fixes.css" "css\mobile-fixes.css" /Y

echo Restaurando JavaScript...
copy "%ULTIMO_RESPALDO%\js\tortas-script.js" "js\tortas-script.js" /Y
copy "%ULTIMO_RESPALDO%\js\tortas-data.js" "js\tortas-data.js" /Y
copy "%ULTIMO_RESPALDO%\js\scroll-to-top.js" "js\scroll-to-top.js" /Y

echo Restaurando HTML...
copy "%ULTIMO_RESPALDO%\html\tortas.html" "html\tortas.html" /Y

echo.
echo ========================================
echo RESTAURACION COMPLETADA
echo ========================================
echo.
echo Los archivos han sido restaurados desde:
echo %ULTIMO_RESPALDO%
echo.
echo IMPORTANTE: Abre el navegador y presiona Ctrl+Shift+R
echo para limpiar el cache y ver los cambios.
echo.
pause
