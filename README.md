# GestionaleEnergy
Gestionale per l'automazione dell'inserimento e gestione degl'imballaggi 

## Comando per eseguire il backup del DB

Se non è stata settata globalmente andare nella directory di **Mysql**: \
`C:\Program Files\MySQL\MySQL Server 8.0\bin`

```bash
mysqldump -u [nome_utente] -p -h [host] --port=[porta] [nome_database] > [path\to\backup\file.sql]
```
