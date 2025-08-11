@echo off

:: Avvia i due server per il Gestionale Balle di Oppimitti Energy

set "GIT_BASH_PATH=C:\Program Files\Git\git-bash.exe"

start "" "%GIT_BASH_PATH%" -c "npm run server:prod"
start "" "%GIT_BASH_PATH%" -c "npm run start"