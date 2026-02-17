// Array dei valori da escludere
const VAL_TO_ESCLUDE = ["id", "status", "idUnique", "plastic", "plasticPresser", "warehouse", "codePlastic"];

/**
 * CheckIfAttributeIsValid
 * Controlla che la chaive passata come parametro sia valida e che non sia presente
 * nell'array degli attirbuti da escludere. \
 * **Di default per convenzione, tutti i dati che si vogliono escludere dal database
 * iniziano con il carattere `-`**.
 * 
 * @param {string} key Chiave dell'array dell'oggetto
 * 
 * @returns true se è valido, false altrimenti
 */
const checkIfAttributeIsValid = (key) => {
    return !key.startsWith("_") && !VAL_TO_ESCLUDE.includes(key);
}

/**
 * Mette in "pausa" per n secondi
 * 
 * @param {*} ms I secondi che verrà messo in pausa 
 * @returns 
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {
    checkIfAttributeIsValid,
    sleep
}