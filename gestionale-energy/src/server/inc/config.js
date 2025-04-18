/**
 * File contenente tutte le condizioni, variabili globali e constanti
 * @author Andrea Storci from Oppimittinetworking.com
 */

/**
 * -------------------------------------------------------------------------
 *                      VERRA' UTILIZZATA PIU' AVANTI
 * -------------------------------------------------------------------------
 * condizione per il conteggio delle balle totali:
 */
// const COND_GET_TOTAL_BALE = `pb_wb.id_implant = ?
//                             AND (presser_bale.id_rei = 1 OR presser_bale.id_rei = 2)
//                             AND wheelman_bale.id_cwb = 1
//                             OR (pb_wb.gam LIKE "%true%" AND pb_wb.gam LIKE "%?%")`;

const COND_ID_IMPLANT = `pb_wb.id_implant = ?`;

const COND_GET_TOTAL_BALE = `${COND_ID_IMPLANT}
                            AND (presser_bale.id_rei = 1 OR presser_bale.id_rei = 2 OR presser_bale.id_rei = 3)
                            AND wheelman_bale.id_cwb = 1
                            AND pb_wb.status = 1`;

const COND_GET_COUNT_PLASTIC_REPORT =   `${COND_ID_IMPLANT}
                                        AND (presser_bale.id_rei = 1 OR presser_bale.id_rei = 2 OR presser_bale.id_rei = 3)
                                        AND (wheelman_bale.id_cwb = 1 AND wheelman_bale.id_wd != 2)
                                        AND pb_wb.status = 1`;

export {
    COND_ID_IMPLANT,
    COND_GET_TOTAL_BALE,
    COND_GET_COUNT_PLASTIC_REPORT
};