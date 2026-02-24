/**
 * @author Andrea Storci from Oppimittinetworking
 * 
 * Classe custom per gesitre gli errori della stampa
 */
class HandleStampaError extends Error {

    constructor(code, message, extra = "") {
        super(message)

        this.code = code === 0 ? 1 : code // codice di errore
        // dovrebbe essere diverso da zero 
        // 1: errore generico
        // 2: balla non specificata
        // 3: errore interno stampante 
        // 4: balla con peso pari a zero
        this.extra = extra
    }


} 

export default HandleStampaError