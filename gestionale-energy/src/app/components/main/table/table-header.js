import React from "react";

import PropTypes from 'prop-types'; // per ESLint

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
    // primary = false,
    style
}) {
    
    // const fixColor = type === "presser" ? " !text-white" : " testoProva";
    const fixColor = " !text-white"; 
    const fixStyle = "resize-none text-left";
    const styleCenter = " !text-center";
    const bgColorPresser = " bgWheelman";
    const bgColorWheelman = " bgPresser";


    // Voci dell'interfaccia Pressista
    const ArrayPresser = ["Sel.", "N°", "Stato", "Plastica", "Codice", "Utiliz. REI", "Stato balla", "Balla Selez.", "Note", "", "Data Ora Press."];
    const ArrayPresserExtension = ["Stato car.", "Motivaz.", "Peso (Kg)","Magazzino Dest.", "Note", "Etichetta", "Data Ora Carr"];
    
    // Voci dell'interfaccia Carrellista
    const ArrayWheelman = ["Sel.", "N°", "Stato", "Plastica", "Stato car.", "Motivaz.", "Peso (Kg)","Magazzino Dest.", "Note", "Etichetta","Data Ora Carr"];
    const ArrayWheelmanExtension = ["Utiliz. REI", "Stato balla", "Balla Selez.", "Note", "Data Ora Pressista"];

    /**
     * ColumnName
     * funzione che renderizza, ovvero stampa le voci della tabella basandosi su
     * un array di stringhe che equivalgono alle voci.
     * Il colore di background viene impostato con il parametro `bgExtension`
     * 
     * @param {string[]}    voci Array contente le voci dell'header
     * @param {string}      bgExtension 
     */
    function ColumnName (voci, bgExtension) {
        return voci.map((col, index) => {
            if (col == "Sel." && admin) return null;
            return (
                <th
                    key={index}
                    className={(col !== "Stato" && col !== "Sel." && col !== "N°")
                        ? (style + fixStyle + fixColor + bgExtension)
                        :(style + fixStyle + fixColor + bgExtension + styleCenter)}
                >
                    {col}
                </th>
            );
        })
    }

    switch (type) {
        case 'presser': 
        {
            return (
                <>
                    <thead className="h-[52px]">
                        <tr>
                            {ColumnName(ArrayPresser, bgColorWheelman)} 
                            {ColumnName(ArrayPresserExtension, bgColorPresser)}                       
                        </tr>
                    </thead>
                </>
            );
        }
        case 'wheelman': {
            return (
                <>
                    <thead className="h-[52px]">
                        <tr>
                            {ColumnName(ArrayWheelman, bgColorPresser)}
                            {ColumnName(ArrayWheelmanExtension, bgColorWheelman)}
                        </tr>
                    </thead>
                </>
            );
        }
    }
}

TableHeader.propTypes = {
    admin: PropTypes.bool,
    type: PropTypes.string.isRequired,
    // primary: PropTypes.bool,
    style: PropTypes.string
};