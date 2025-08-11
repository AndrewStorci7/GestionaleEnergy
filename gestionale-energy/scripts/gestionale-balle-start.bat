@echo off

:: Avvia i due server per il Gestionale Balle di Oppimitti Energy

set "GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe"

cd /d ..
start "" "%GIT_BASH_PATH%" -c "npm run server:prod"
start "" "%GIT_BASH_PATH%" -c "npm run start"

@REM cd /d ..
@REM start cmd /k "npm run server:prod"
@REM start cmd /k "npm run start"
