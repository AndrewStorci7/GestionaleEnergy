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

## Ricezione delle modifiche da remoto (se richiesto o per sicurezza)

Eseguire il fetch e il pull delle modifiche di altri branch
```bash
> git fetch origin
> git pull origin
```

## Istruzioni per inviare le modifiche

> :warning: Fare le commit delle modifiche importanti e dopo (alla fine) eseguire la `push`


### Primo fase

Aggiungere tutti i file nello stash (importante: bisogna essere nella directory `/GestionaleEnergy`):
```bash
> git add .
```

> :bulb: Per vedere le modifiche: \
> `git status`

### Seconda fase

Eseguire la commit:
```bash
> git commit -m "messaggio"
```

### Terza fase

Una volta che si ha finito il lavoro o la giornata inviare le modifiche al server:
```bash
> git push origin
```
