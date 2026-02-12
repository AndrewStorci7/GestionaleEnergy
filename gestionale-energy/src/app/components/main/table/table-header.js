import React from "react";

import PropTypes from 'prop-types'; // per ESLint
import Script from "next/script";

/**
 * @param {boolean} admin   Serve per gestire la visibilità di alcune colonne nel caso in cui la tabella venga vista da un amministratore; Default: false
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * @param {boolean} primary Serve per settare correttamente il colore dello sfondo   
 *  
 * @returns 
 */
export default function TableHeader({ 
    admin = false,
    type, 
    primary = false,
    style
}) {
    
    // const fixColor = type === "presser" ? " !text-white" : " testoProva";
    const fixColor = " !text-white"; 
    const fixStyle = "resize-none !text-left";
    const bgColorPresserExtension = " bg-blue-400";
    const bgColorWheelmanExtension = " bg-blue-800";
    const ArrayPresser = ["Sel.", "N°", "Stato", "Plastica", "Codice", "Utiliz. REI", "Stato balla", "Balla Selez.", "Note", "", "Data Ora Pressista"];
    const ArrayPresserExtension = ["Stato carrello", "Motivaz.", "Peso (Kg)", "Note", "Etichetta", "Data Ora Carrellista"];
    const ArrayWheelman = ["Sel.", "N°", "Stato", "Plastica", "Stato carrello", "Motivaz.", "Peso (Kg)", "Arrivo", "Note", "Stato stampa", "","Data Ora Carrellista"];
    const ArrayWheelmanExtension = ["Utiliz. REI", "Stato balla", "Balla Selez.", "Note", "Data Ora Pressista"];
    function ColumnName (Array, bgExtension) {
        return Array.map((col, index) => {
            if (col === "Sel." && admin) {
                return null;
            }
            else {
            return (<th key={index} className={style + fixStyle +fixColor + bgExtension}>{col}</th>)
            }
        })
    }

    switch (type) {
        case 'presser': 
        {
            return (
                <>
                    <thead className="h-[52px]">
                        {ColumnName(ArrayPresser, "")} 
                        {ColumnName(ArrayPresserExtension, bgColorPresserExtension)}                       
                    </thead>
                </>
            );
        }
        case 'wheelman': {
            return (
                <>
                    <thead className="h-[52px]">
                        {ColumnName(ArrayWheelman, "")}
                        {ColumnName(ArrayWheelmanExtension, bgColorWheelmanExtension)}
                        
                        {/* <tr>
                            {(primary && !admin) && <th className={style + fixColor + " !pl-3"}>Sel.</th>}
                            {(primary) && <th className={style + fixColor}>N°</th>}
                            {(primary) && <th className={style + fixColor}>Stato</th>}
                            {(primary) && <th className={style + fixStyle + fixColor}>Plastica</th>}
                            <th className={style + fixStyle + fixColor + fixStyle}><p className="truncate">Balla al carrello</p></th>
                            <th className={style + fixStyle + fixColor}>Motivaz.</th>
                            <th className={style + fixStyle + fixColor}>Peso (Kg)</th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Mag. Destinazione</p></th>
                            <th className={style + fixStyle + fixColor}>Note</th>
                            <th className={style + fixStyle + fixColor}><p className="truncate">Stato stampa</p></th>
                            {(primary) && <th className={style + fixStyle + fixColor + "w-[40px]"}></th>}
                            <th className={style + fixStyle + fixColor}>Data</th>
                            <th className={style + fixStyle + fixColor}>Ora</th>
                        </tr> */}
                    </thead>
                </>
            );
        }
    }
}

TableHeader.propTypes = {
    admin: PropTypes.bool,
    type: PropTypes.string.isRequired,
    primary: PropTypes.bool,
    style: PropTypes.string
};