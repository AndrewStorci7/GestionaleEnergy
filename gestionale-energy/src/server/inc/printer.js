import net from 'net';
import Console from '../inc/console.js';
const console = new Console("Printer", 1);

/**
 * Printer class for sending ZPL commands to a Zebra printer.
 * @author Andrea Storci from Oppimittinetworking
 */
class Printer {

    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.fontSize = 150;
        this.fontSizeSpecificMsg = 70;
        this.rotation = 'B';
        this.rotationSpecificMsg = 'I'

        // misure stampa
        this.xOffsetSpecificMsg = 200;
        this.xOffset3rdRow = 400; // X coordinate Terza riga
        this.xOffset2ndRow = 230; // X coordinate Seconda riga
        this.xOffset1stRow = 50; // X coordinate Prima riga

        this.yOffsetSpecificMsg = 500;
        this.yOffsetData = 700; // Y coordinate Data 
        this.yOffsetTurn = 1000 + this.yOffsetData; // Y coordinate Turno
        this.yOffsetWeight = 1500; // Y coordinate Peso 
        this.yOffsetPlastic = 900; // Y coordinate Plastica
    }

    parseZebraStatus(raw) {
        //const regex = /\u0002|\u0003/;
        // eslint-disable-next-line no-control-regex
        const cleaned = raw.replace(/[\u0002\u0003]/g, '').trim();

        const errorsLine = cleaned.split('ERRORI:')[1].split('AVVERTIMENTI:')[0].trim();
        // const warningsLine = raw.trim().split('AVVERTIMENTI:');

        const errorsNum = errorsLine.split(/\s+/);
        // console.log(errorsNum)
        // const warningsNum = parseInt(warningsLine.split(' ')[1], 10);

        // Mappa semplificata dei codici verso messaggi leggibili
        const codeMessages = {
            '00010000': 'Stampante in pausa, premere il bottone per riavviarla',
            '00010001': 'Etichette esaurite',
            '00010002': 'Ribbon esaurito, oppure carta inceppata',
            '00010004': 'Testina di stampa aperta',
            '00000004': 'Porta aperta',
        };

        const messages = [];

        errorsNum.forEach((code, index) => {
            if (index !== 0) {
                if (codeMessages[code]) messages.push(codeMessages[code]);
                else if (code !== "00000000") messages.push(`Errore sconosciuto: ${code}`);
            }
        });

        // warningCodes.forEach(code => {
        //     if (codeMessages[code]) messages.push(`Avviso: ${codeMessages[code]}`);
        // });

        return {
            hasErrors: errorsNum[0] > 0,
            // hasWarnings: warningsNum > 0,
            messages,
            raw
        };
    }

    async check(req, res) {
        // return Promise((resolve, reject) => {
            const ip = process.env.IP_STAMPANTE_ZEBRA;
            const port = process.env.PORT_STAMPANTE_ZEBRA;
            try {
                const client = new net.Socket();
                client.connect(port, ip, () => {
                    client.write("~HQES");
                })

                client.on('data', (data) => {
                    const status = data.toString();
                    const parsedStatus = this.parseZebraStatus(status);
                    if (parsedStatus.hasErrors) {
                        res.json({ code: -1, message: parsedStatus.messages });
                    } else {
                        res.json({ code: 0, message: "ok" })
                    }
                    client.destroy();
                });

                client.on('error', (err) => {
                    res.json({ code: -1, message: err.message });
                });
            } catch (err) {
                res.status(500).json({ code: -1, message: err.message })
            }
        // })
    }

    /**
     * Prints a ZPL string to the printer.
     * @param {*} plastic Tipo di plastica da stampare
     * @param {*} weight Peso della plastica da stampare
     * @param {*} turn Numero del turno
     * @param {*} date Data della stampa
     * @returns 
     */
    async print(plastic = "", weight = 0, turn = 0, date = "", corepla = "") {
        return new Promise((resolve, reject) => {
            try {
                if (plastic === "" || weight === 0 || turn === 0 || date === "") {
                    return resolve({ code: -1, message: "Dati non corretti per la stampa" });
                }
                const client = new net.Socket();
                const zpl = `
^XA
^PW1632
^LL440
^LH0,0

^FO${this.xOffset1stRow},${this.yOffsetPlastic}^A0${this.rotation},${this.fontSize},${this.fontSize}^FD${plastic}^FS
^FO${this.xOffset2ndRow},${this.yOffsetWeight}^A0${this.rotation},${this.fontSize},${this.fontSize}^FD${weight}^FS
^FO${this.xOffset3rdRow},${this.yOffsetTurn}^A0${this.rotation},${this.fontSize},${this.fontSize}^FD${turn}^FS
^FO${this.xOffset3rdRow},${this.yOffsetData}^A0${this.rotation},${this.fontSize},${this.fontSize}^FD${date}^FS
^FO${this.xOffsetSpecificMsg},${this.yOffsetSpecificMsg}^A0${this.rotationSpecificMsg},${this.fontSizeSpecificMsg},${this.fontSizeSpecificMsg}^FD${corepla}^FS
^XZ
                `;

                client.connect(this.port, this.ip, () => {
                    client.write(zpl, (err) => {
                        if (err) {
                            client.end();
                            return reject({ code: -1, message: `Errore nell'invio ZPL: ${err.message}` });
                        }

                        // console.log("ZPL command sent");
                        client.end();
                        return resolve({ code: 0, message: "Stampa eseguita" });
                    });
                });

                // client.on("data", (data) => {
                //     // console.log("Printer response:", data.toString());
                // });

                client.on("error", (err) => {
                    console.error(`Errore di connessione: ${err.message}`);
                    if (!client.destroyed) client.end();
                    return reject({ code: -1, message: err.message });
                });
            } catch (error) {
                console.error(`Print error: ${error.message}`);
                reject(error);
                // res.status(500).json({ success: false, error: error.message });
            }
        })
    }
} 

export default Printer;