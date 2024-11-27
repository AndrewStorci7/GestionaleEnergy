# TODO

## Tabella contenuti (`<TableContent>`)

- [x] Allineare il font a sinistra all'interno delle celle della tabella
- Cambiare sfondo tabella primaria:
    - [x] Per la parte **Pressista** mettere il colore `#e01b26` per l'**header** e `#fdedee` per il **tbody**
    - [x] Per la parte **Carrellista** mettere il colore `#1c6a06` per l'**header** e `#f0feec` per il **tbody**
- [x] Inserire spazio tra il `label` e tra la tabella
- [x] Inserire spazio (margine) tra una tabella e l'altra (possibile soluzione: _inserire `gap-4` per creare spazio tra le due componenti_)
- [x] Massima visualizzazione di righe: **100**
- [ ] Spostare ed "incollare" i pulsanti sopra il **footer**
- Modificare il pulsante di conferma per **l'inserimento sul DB**
    - [x] Cambiare il colore del pulsante di conferma in grigio (`thirdary`) e renderlo più grande
    - [x] Spostare il pulsante sulla terzultima colonna ed inserire la data e l'ora dopo averlo cliccato

## Header (`<Header>`)

- Cambiare la visualizzazione dei dati dell'utente:
    - [x] Adattare il colore dello sfondo in base al tipo di utente
    - [x] Aggiungere la denominazione sotto allo username
    - [x] Aggiungere tasto **logout**
- [x] Creare funzione per **logout**
- [x] Sistemare controllo turno, il controllo deve avvenire con l'ora:
    - Dalle **6** alle **12**: **Turno 1**
    - Dalle **12** alle **18**: **Turno 2**
    - Dalle **18** alle **24**: **Turno 3**