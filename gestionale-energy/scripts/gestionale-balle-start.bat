@echo off

:: Avvia i due server per il Gestionale Balle di Oppimitti Energy

cd /d ..
start cmd /k "npm run server:prod"
start cmd /k "npm run start"
