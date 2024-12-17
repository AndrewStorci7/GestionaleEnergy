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

### Per spostarsi da un branch all'altro

per spostarsi in un branch differente:
```bash
git checkout <nome_branch>
/// Ad esempio
git checkout dev/addNewBale
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
