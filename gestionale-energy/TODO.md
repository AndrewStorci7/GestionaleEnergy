# TODO

## Frontend :panda_face:

### Tabella contenuti (`<TableContent>`)

- [x] Allineare il font a sinistra all'interno delle celle della tabella
- Cambiare sfondo tabella primaria:
    - [x] Per la parte **Pressista** mettere il colore `#e01b26` per l'**header** e `#fdedee` per il **tbody**
    - [x] Per la parte **Carrellista** mettere il colore `#1c6a06` per l'**header** e `#f0feec` per il **tbody**
- [x] Inserire spazio tra il `label` e tra la tabella
- [x] Inserire spazio (margine) tra una tabella e l'altra (possibile soluzione: _inserire `gap-4` per creare spazio tra le due componenti_)
- [x] Massima visualizzazione di righe: **100**
- Modificare il pulsante di conferma per **l'inserimento sul DB**
    - [x] Cambiare il colore del pulsante di conferma in grigio (`thirdary`) e renderlo più grande
    - [x] Spostare il pulsante sulla terzultima colonna ed inserire la data e l'ora dopo averlo cliccato
- [x] Spostare ed "incollare" i pulsanti sopra il **footer**
- [x] Inserire **overflow** (scorrimento) solo nella visualizzazione della tabella
- [ ] Modificare e inserire `inner box-shadow` (informarsi su `tailwindcss`)

### Header (`<Header>`)

- Cambiare la visualizzazione dei dati dell'utente:
    - [x] Adattare il colore dello sfondo in base al tipo di utente
    - [x] Aggiungere la denominazione sotto allo username
    - [x] Aggiungere tasto **logout**
- [x] Creare funzione per **logout**
- [x] Sistemare controllo turno, il controllo deve avvenire con l'ora:
    - Dalle **6** alle **14**: **Turno 1**
    - Dalle **14** alle **22**: **Turno 2**
    - Dalle **22** alle **6**: **Turno 3**

### Barra di ricerca (`<Search>`)

- [x] Costrutire la barra di ricerca

## Backend :space_invader:

### Server

- [ ] Creare rotta per creazione di una balla:
    - Al momento del click del pulsante _"aggiungi"_ verrà richiamata la rotta `/bale` e creerà nel database una row in `pb_wb` contenente i dati del pressista (`presser_bale`) e quelli del carrellista ((`wheelman_bale`) vuoti) 

### Database 

- [x] Inserire dati per test

### Errori:

- `Cannot update a component ('HotReload') while rendering a different component ('TableContent'). To locate the bad setState() call inside 'TableContent', follow the stack trace as described in https://react.dev/link/setstate-in-render`

To download and install time zone files on MySQL running on Windows, you will need to follow these steps:

### 1. **Download the Time Zone Files**
You can download the time zone files for MySQL from the official MySQL website. MySQL provides pre-built time zone files in a format that can be loaded into your database.

- Go to the official MySQL website for downloading the time zone information:
  - [MySQL Time Zone Files Download](https://dev.mysql.com/downloads/timezones.html)
  
- Download the appropriate version of the time zone files for your version of MySQL.

If you can't find a direct download, here's another alternative:

- [Download the Time Zone Files Archive (tar.gz)](https://dev.mysql.com/downloads/connector/mysql-connector-odbc/)
  
   - Choose the `tar.gz` archive.
   - Unzip the archive and extract the contents to a folder.

### 2. **Locate MySQL's `mysql_tzinfo_to_sql` Utility**

MySQL includes a tool called `mysql_tzinfo_to_sql` that can convert the system time zone data into a format that MySQL can understand. However, on Windows, this utility may not be installed by default.

Here’s what you can do:

1. **Find the Time Zone Files on Your System**
   You need to identify the path to the system time zone files on Windows. Typically, on Windows, these files may not be available by default in a specific location, so you might need to obtain the time zone information from external sources.

2. **Using the Time Zone Files (Manually Extract)**
   If you're unable to use `mysql_tzinfo_to_sql` directly, you can manually download the required time zone files or get them from a Linux environment.

### 3. **Alternative Method: Manually Load Time Zones from a Prebuilt File**

Here’s how you can manually install the time zone tables by importing them into MySQL on Windows:

1. **Get the Time Zone SQL File**:
   You can download the time zone information directly from an external source like:
   - [GitHub MySQL Timezones Repository](https://github.com/mysqltz/mysql-timezones)

   In this repository, you can find the `mysql_tzinfo_to_sql` output in the form of SQL files for time zone data.

2. **Import Time Zone Data into MySQL**:
   Once you have the time zone SQL file, you can load the time zone information into MySQL using the `mysql` command-line tool. Here's how to do it:

   - Open a command prompt (Windows).
   - Navigate to the folder containing the SQL file you downloaded (e.g., `timezone_2020.sql`).
   - Run the following command to load the time zone data:

     ```bash
     mysql -u root -p mysql < timezone_2020.sql
     ```

     Replace `timezone_2020.sql` with the name of the file you downloaded.

3. **Verify the Time Zone Data**:
   After importing, you can verify that the time zone data was correctly loaded by running the following SQL queries:

   ```sql
   SELECT * FROM mysql.time_zone_name;
   ```

   If the time zone names appear correctly, the data has been successfully loaded.

### 4. **Set the Global Time Zone**

Once the time zone data is loaded, you should be able to set the global time zone for MySQL using the command:

```sql
SET GLOBAL time_zone = 'Europe/Rome';
```

Verify the change:

```sql
SELECT @@global.time_zone;
```

### 5. **Restart MySQL**

Sometimes, after loading the time zone data, you may need to restart the MySQL server to ensure everything is properly recognized. You can do this by restarting the MySQL service from the Windows Services panel or by running the following command:

```bash
net stop mysql
net start mysql
```

### Summary of Steps:
1. Download or obtain the time zone data files (e.g., from GitHub or MySQL).
2. Use `mysql_tzinfo_to_sql` to convert or manually download and use SQL files.
3. Load the time zone data into MySQL via the command-line.
4. Set the global time zone.
5. Restart MySQL if necessary.

If you follow these steps, you should be able to configure the time zone properly on your Windows-based MySQL server.