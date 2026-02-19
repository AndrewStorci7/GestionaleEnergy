# Pipeline dei test

> :warning: **CONSIGLIO!** \
> E' consigliata la visione del seguente file direttamente da [github:gestionale-energy](https://github.com/AndrewStorci7/GestionaleEnergy/tree/master).

# Indice

- [Test Login](#login-e-accessi)
- [Test Pressista](#pagina-panel-utente-pressista)
- [Test Carrellista](#pagina-panel-utente-carrellista)
- [Test versione `v1.9.0`](#funzionalità-versione-nuovo-rilascio-v190)

## Inizio

Creare una nuova cartella all'interno della cartella `Dati on` in: `O:\LABORATORIO\Sviluppo Software\GestionaleEnergy\TEST`
con `test-` seguito dalla data di creazione. \
**Esempio: `test-180226`**

Creare un file excel dove segnarti i passaggi, ogni test avrà il suo `ID`. 
Dovrai creare tre colonne:
- Una per l'`ID`
- Una per lo stato
- Una per la data di inizio test
- Una per la data di fine test
- Una per inserire le note, in caso di errori o considerazioni

Nel file excel ogni volta che farai un test dovra inserire il suo `ID` e nella colonna dello stato una di queste informazioni:
- `in esecuzione`: che indica que il test lo stai facendo
- `ok`: che indica se il test è stato concluso, senza alcun errore
- `errore`: che indica che hai trovato un errore, il quale andrai a descrivere nella colonna delle note/considerazioni
- `warning`: che indica che il test è stato concluso ma ci sono delle considerazioni da fare (le considerazioni non sono errori, ma delle cose che potrebbero essere migliorate)

Nel caso in cui ci sia bisogno di allegare delle immagini per provare l'errore o la considerazione, andranno inserite nella cartella creata all'inizio rinominando l'immagine con **l'id del test** (se c'è ne sono di più aggiugnere un incrementatore).

### Creare branch di test

creare un nuovo branch chiamato `test/<versione>` (per la versione, basta prendere la versione presente in `package.json` oppure su github sono presenti le **release**; incrementare l'ultima rilasciata).

Il branch va creato dal branch che contiene l'ultimo codice disponibile e finito.

### Compilare il progetto

Prima di iniziare i test devi compilare il progetto.

#### 1. Installare le librerie

esegui il comando nella cartella `gestionale-energy`:
```
> npm install
```

in caso di **errori** durante l'installazione si può tentare ad eseguire il comando con la flag `--legacy-peer-deps`:
```
> npm install --legacy-peer-deps 
```

> :warning: Attenzione! \
> Se viene generato un errore dopo il comando di installazione dei pacchetti, FERMARSI e segnalarlo al referente

#### 2. Compilare il progetto

sempre all'interno della cartella `gestionale-energy`:
```
> npm run build
```

##### 2a. Gestire i vari errori

In presenza di errori (molto probabilmente generati da ESLint) vanno gestiti e risolti

#### 3. Avviare il progetto compilato

Se si sta eseguendo il test su una macchina che **non è il server dell'ufficio di Varano**, bisogna verificare che il container docker contenente il database sia in funzione. \
Per controllare basta aprire **Docker Desktop** e nel caso in cui non sia aperto, eseguire i passaggi presenti nella cartella `mysql-container` per far partire il container.

**Verificare** che il file `.env.production` sia corretto con tutti i valori. \
Per esempio: se si sta eseguendo il test su una macchina con ip locale `192.168.0.89` andrà inserito quel dato per ogni variabile che lo richiede (come per esempio: `NEXT_PUBLIC_APP_WS_URL`, `NEXT_PUBLIC_WS_URL`).

Se non è presente il file `.env.production` è possibile prendere il **sample** da `DATI-ON\` e poi compilarlo con i dati corretti

Nella cartella `gestionale-energy/scripts` è presente il file `gestionale-balle-start.bat`; avviarlo per fare in modo che siano avviati i seguenti processi:
- `npm run start`: next.js
- `npm run server:prod`: server express

## Pipeline

### Login e accessi

| id | nome | descrizione | Esito | 
|-|-|-|-|
| 1.1 | Login con `utente01` | eseguire il login per verificare se l'accesso avviene correttamente; controllare che in memoria (ovvero i cookies) ci sia il dato `"user-info"` e che sia popolato correttamente. | Visibile pagina con interfaccia utente `presser` (**Pressista**) |
| 1.2 | Login con `utente02` | eseguire il login per verificare se l'accesso avviene correttamente; controllare che in memoria (ovvero i cookies) ci sia il dato `"user-info"` e che sia popolato correttamente. | Visibile pagina con interfaccia utente `wheelman` (**Carrellista**) |
| 1.3 | Login con `utente03` | eseguire il login per verificare se l'accesso avviene correttamente; controllare che in memoria (ovvero i cookies) ci sia il dato `"user-info"` e che sia popolato correttamente. | Visibile pagina con interfaccia utente `admin` |
| 1.4 | Scelta dell'impianto | Verificare che la scelta dell'impianto sia corretta; verificare che faccia visualizzare tutti gli impianti presenti ((**opzionale ma solo per scopo di verifica**) verificare anche sul db); verificare che in caso di non scelta dell'impianto dia "errore" (che venga impedito l'accesso) | Che siano visibili tutti gli impianti presenti sul db |
| 1.5 | Utente errato | Verificare che in caso di utente errato dia un messaggio di errore e che non permetta di accedere | 
| 1.6 | Accesso pagina `pages/panel` 1 | Verificare che in caso di **NON** accesso, la pagina mi reinderizzi alla pagina di login | Accesso alla pagina
| 1.7 | Accesso pagina `pages/panel` 2 | Verificare che in caso di accesso, la pagina sia visibile | Redirect alla pagina di `login`
| 1.8 | Controllo cookies | ***(i cookies dovrebbero durare un giorno [24h])*** </br> Verificare che allo scadere delle 24h il cookie sia eliminato (per testare, cambaire l'orario del PC) | 

### Pagina `panel` utente **Pressista**

> :warning: **ATTENZIONE!** \
> **Quando si eseguono questi test, aprire due finestre di due browser diversi e accedere con *pressista* e *carrellista* per verificare che le modifhe si vedano in tempo reale** 

| id | nome | descrizione | Esito |
|-|-|-|-|
| 2.1 | Verificare i dati | Verificare che i dati siano visibili correttamente, che ogni colonna sia popolata dal dato corrispettivo, che non ci siano errori nei dati e che ridimensionando la pagina i dati siano visibili correttamente; provare ogni tipo di situazione pensabile per la visualizzazione della pagina e verificare che in caso di pagina ristretta, la tabella sia scorrevole da destra verso sinistra "facilmente" e intuibile |
| 2.2 | Verificare dati nell'header | Verificare che i dati presenti nell'header siano corretti, ovvero, che restituisca i valori di produzione corretti (si può provare inserendo, modifica ed eliminando le balle) |
| 2.3 | Elimina di una balla **CON balla selezionata** | Selezionare una balla e provare ad eliminarla | Balla eliminata e aggiornamento automatico delle balle |
| 2.4 | Elimina di una balla **SENZA balla selezionata** | Selezionare una balla e provare ad eliminarla | Comparsa dell'alert di errore |
| 2.5 | Modifica di una balla **CON balla selezionata** | Selezionare una balla e provare a modificarla | Comparsa dell'alert con i dati da modificare |
| 2.6 | Modifica di una balla **SENZA balla selezionata** | Selezionare una balla e provare a modificarla | Comparsa dell'alert di errore |
| 2.7 | Modifica di una balla 1 | Selezionare una balla e provare a modificarla; Verificare che i dati visualizzati nell'alert siano corretti; |
| 2.8 | Modifica di una balla 2 | Provare a modificare i dati; Provare a inserire il tipo di plastica `"-"` | Bottone di conferma non cliccabile |
| 2.9 | Modifica di una balla 3 | Provare a modificare i dati; Provare a modificare i dati e cliccare su **conferma** | ogni volta che cambi un dato si deve visualizzare il messaggio "Modifche non salvate"; Confermando la modifica lo stato della balla deve passare a `-1` che equivale ad una icona rossa |
| 2.10 | Modifica di una balla 4 | Provare a modificare i dati; Provare a modificare i dati e cliccare su **annulla** | ogni volta che cambi un dato si deve visualizzare il messaggio "Modifche non salvate"; Annullando le modifiche non dovrebbero essere visibili cambiamenti nei dati |
| 2.11 | Verificare orario | Verificare che l'orario sia aggioranto e corretto |
| 2.12 | Verifica turno | Controllare che il turno, cambi in base all'orario.  </br> *Cambiare l'orario del pc per verificare questa cosa*. | </br> **Turno 1**: dalle 6 alle 14 </br> **Turno 2**: dalle 14 alle 22 </br> **Turno 3**: dalle 22 alle 6 |
| 2.13 | Verificare selezione balla | Provare a cliccare una balla; con la balla selezioanta provare a selezionarne una diversa | Dovrebbe essere selezionabile una balla alla volta |

### Pagina `panel` utente **Carrellista**

> :warning: **ATTENZIONE!** \
> **Quando si eseguono questi test, aprire due finestre di due browser diversi e accedere con *pressista* e *carrellista* per verificare che le modifhe si vedano in tempo reale** 

| id | nome | descrizione | Esito |
|-|-|-|-|
| 3.1 | Verificare i dati | Verificare che i dati siano visibili correttamente, che ogni colonna sia popolata dal dato corrispettivo, che non ci siano errori nei dati e che ridimensionando la pagina i dati siano visibili correttamente; provare ogni tipo di situazione pensabile per la visualizzazione della pagina e verificare che in caso di pagina ristretta, la tabella sia scorrevole da destra verso sinistra "facilmente" e intuibile |
| 3.2 | Verificare dati nell'header | Verificare che i dati presenti nell'header siano corretti, ovvero, che restituisca i valori di produzione corretti |
| 3.3 | Modifica di una balla **CON balla selezionata** | Selezionare una balla e provare a modificarla | Comparsa dell'alert con i dati da modificare |
| 3.4 | Modifica di una balla **SENZA balla selezionata** | Selezionare una balla e provare a modificarla | Comparsa dell'alert di errore |
| 3.5 | Modifica di una balla 1 | Selezionare una balla e provare a modificarla; Verificare che i dati visualizzati nell'alert siano corretti; |
| 3.6 | Modifica di una balla 2 | Provare a modificare i dati; Provare a inserire il tipo di plastica `"-"` | Bottone di conferma non cliccabile |
| 3.7 | Modifica di una balla 3 | Provare a modificare i dati; Provare a modificare i dati e cliccare su **conferma** | ogni volta che cambi un dato si deve visualizzare il messaggio "Modifche non salvate"; Confermando la modifica lo stato della balla deve passare a `-1` che equivale ad una icona rossa |
| 3.8 | Modifica di una balla 4 | Provare a modificare i dati; Provare a modificare i dati e cliccare su **annulla** | ogni volta che cambi un dato si deve visualizzare il messaggio "Modifche non salvate"; Annullando le modifiche non dovrebbero essere visibili cambiamenti nei dati |
| 3.9 | Modifica di una balla 5 | Selezionare come primo valore (**"Cond. Balla Carrel."**) `"Legata"` e poi provare a selezionare una **Motivazione** | La motivazione **non** dovrebbe essere selzionabile |
| 3.10 | Modifica di una balla 6 | Selezionare come primo valore (**"Cond. Balla Carrel."**) `"Legata"` e poi provare a selezionare una **Motivazione** | La motivazione **dovrebbe** essere selzionabile |
| 3.11 | Verificare orario | Verificare che l'orario sia aggioranto e corretto |
| 3.12 | Verifica turno | Controllare che il turno, cambi in base all'orario.  </br> *Cambiare l'orario del pc per verificare questa cosa*. | </br> **Turno 1**: dalle 6 alle 14 </br> **Turno 2**: dalle 14 alle 22 </br> **Turno 3**: dalle 22 alle 6 |
| 3.13 | Verificare selezione balla | Provare a cliccare una balla; con la balla selezioanta provare a selezionarne una diversa | Dovrebbe essere selezionabile una balla alla volta |

### Funzionalità versione nuovo rilascio `v1.9.0`

> :warning: **Attenzione!** \
> Eseguire il seguente test sia per **carrellista** che per **pressista**. \
> Ogni volta che si fa un test per carrellista, nel file excel va aggiunto alla fine dell'id del test il carattere `-c` per **carrellista** e `-p` per **pressista**

| id | nome | descrizione | Esito |
|-|-|-|-|
| 1.9.0-0 | Verificare versione nel **footer** | Verificare che la versione visualizzata nel footer sia la `1.9.0` |
| 1.9.0-1 | Verifica dimensione tabella | Verificare che la tabella a schermo intero sia ben visibile; Verificare a schermo con dimensione ridotta se i dati sono visibili in maniera acceessibile; verificare che i dati siano scorrevoli sia dall'alto verso il basso che da destra verso sinistra | 
| 1.9.0-2 | Verificare ALLUM e FERRO | Verificare che in caso di presenza di un dato con plastica uguale a **FERRO** o **ALLUM** lo sfondo sia grigio (o diverso) dagli altri |
| 1.9.0-3 | Verificare bottone **"Attiva Filtro"** | Verificare che il bottone, una volta cliccato, faccia visualizzare la maschera per poter filtrare i dati; Cliccare di nuovo il pulsatne per verificare che venga nascosta | Bottone che attiva e disattiva la maschera per filtrare |
| 1.9.0-4 | Verificare bottone cambio impianto rapido 1 | Verificare che **non** sia presente la voce di default: "Seleziona un immpianto"; Verificare che vengano visualizzati gli impianti; |  
| 1.9.0-5 | Verificare bottone cambio impianto rapido 2 | Verificare che cliccando un altro impianto venga visualizzata la cschermata di caricamento e che alla fine del caricamento vengano aggiornati i dati: sia quelli della **tabella** che quelli dell'header (**i contatori**) |
| 1.9.0-6 | Verificare colore dati | Verificare il colore di sfondo dei dati (sia per carrellista che per pressista); i dati del carrellista dovrebbero essere colorati con un colore diverso e viceversa |
| 1.9.0-7 | Verificare aggiunta nuova balla | Verificare che l'**aggiunta** della nuova balla sia corretta dopo aver fatto il cambio dell'impianto tramite il **bottone rapido** | Correttezza dei dati |
| 1.9.0-8 | Verifica elimina balla | Verificare che l'**elimina** della balla sia corretta dopo aver fatto il cambio dell'impianto tramite il **bottone rapido** | Correttezza dei dati |
| 1.9.0-9 | Verifica modifica balla | Verificare che la **modifica** della balla sia corretta dopo aver fatto il cambio dell'impianto tramite il **bottone rapido** | Correttezza dei dati |
| 1.9.0-10 | Verifica colore balle completate | Verificare che il colore dello sfonod delle balle completate sia diverso da quello delle balle in lavorazione |