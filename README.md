# GestionaleEnergy
Gestionale per l'automazione dell'inserimento e gestione degl'imballaggi 

## Comando per eseguire il backup del DB

Se non è stata settata globalmente andare nella directory di **Mysql**: \
`C:\Program Files\MySQL\MySQL Server 8.0\bin`

```bash
mysqldump -u [nome_utente] -p -h [host] --port=[porta] [nome_database] > [path\to\backup\file.sql]
```

## Istruzioni per Dev

### Prima fase

Far partire il web hosting:
- spostarsi nella cartella del progetto `/gestionale-energy`
- far avviare il web hosting:
```bash
> npm run dev
```

### Seconda fase 

Su un'altra finestra del terminale andare nella directory `.../gestionale-energy/src/server/` e digitare:
```bash
> node app.js
```