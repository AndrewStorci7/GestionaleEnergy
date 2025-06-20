@echo off
setlocal ENABLEEXTENSIONS
cd /d %~dp0

:: CONFIGURAZIONE
set "GITHUB_REPO=AndrewStorci7/GestionaleEnergy"
set "INSTALL_DIR=C:\GestionaleBalle"
set "DB_NAME=on_gestionale_balle"
set "SQL_FILE=%~dp0on_gestionale_balle.sql"

echo Verifica presenza di Chocolatey...
where choco >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Chocolatey non trovato. Lo installo...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; iex ((New-Object Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"

    IF %ERRORLEVEL% NEQ 0 (
        echo ERRORE durante l'installazione di Chocolatey. Uscita...
        exit /b 1
    )
)

:: Refresh variabili ambiente
echo Aggiornamento variabili ambiente...
call "%ALLUSERSPROFILE%\chocolatey\bin\refreshenv.cmd"

:: Verifica presenza Node.js
echo Verifica presenza di Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js non trovato. Lo installo...
    choco install nodejs -y
    if %ERRORLEVEL% neq 0 (
        echo ERRORE durante l'installazione di Node.js. Uscita...
        exit /b 1
    )
)

:: Verifica presenza MySQL
echo Verifica presenza di MySQL...
where mysql >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo MySQL non trovato. Lo installo...
    choco install mysql -y
    if %ERRORLEVEL% neq 0 (
        echo ERRORE durante l'installazione di MySQL. Uscita...
        exit /b 1
    )
)

echo Tutto installato correttamente!
pause

:: Chiedi credenziali MySQL
set /p MYSQL_USER=Inserisci il nome utente MySQL: 
set /p MYSQL_PWD=Inserisci la password MySQL: 

:: Importa il database
echo Importazione del database...
mysql -u%MYSQL_USER% -p%MYSQL_PWD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" 
mysql -u%MYSQL_USER% -p%MYSQL_PWD% %DB_NAME% < "%SQL_FILE%"

:: Crea cartella se non esiste
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

:: Scarica l’ultima release da GitHub via PowerShell
echo Scaricamento dell'ultima release GitHub...
powershell -Command ^
    "$releases = Invoke-RestMethod -Uri https://api.github.com/repos/%GITHUB_REPO%/releases/latest; ^
     $zipUrl = $releases.assets | Where-Object { $_.name -like '*.zip' } | Select-Object -First 1 -ExpandProperty browser_download_url; ^
     Invoke-WebRequest -Uri $zipUrl -OutFile 'release.zip'"

:: Decomprime
powershell -Command "Expand-Archive -Path 'release.zip' -DestinationPath '%INSTALL_DIR%' -Force"
del release.zip

:: Installa dipendenze npm
cd /d "%INSTALL_DIR%"
call npm install

echo.
echo ✅ Installazione completata con successo!
pause
:: exit /b
