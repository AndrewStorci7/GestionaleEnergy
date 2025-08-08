'use client';
import React, { useEffect, useMemo } from 'react';
import TableContent from './table-content';
import TableHeader from './table-header';

import PropTypes from 'prop-types'; // per ESLint

const TableWrapper = ({
    admin = false,
    tableContent = null,
    type,
    primary = false,
    ...props
}) => {
    
    const backgroundColor = useMemo(() => {
        return type === 'presser' ? "bgPresser dark:bg-red-800/25" : "bgWheelman dark:bg-green-800/25";
    }, [type]);

    const safeType = useMemo(() => {
        if (!type || (type !== 'presser' && type !== 'wheelman')) {
            console.warn(`Invalid type received: ${type}, defaulting to 'presser'`);
            return 'presser';
        }
        return type;
    }, [type]);

    useEffect(() => {
        if (!tableContent) {
            console.error("TableContent non definito");
        }
    }, [tableContent]);

    return (
        <div {...props}>
            <div className={`not-prose shadow-sm relative rounded-xl overflow-hidden ${backgroundColor}`}>
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(133, 50, 50, 0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(129, 79, 79, 0.6),rgba(187, 74, 74, 0.5))]">
                    <h2 className='font-bold text-xl px-4 pt-[5px] text-white'>
                        {safeType === 'presser' ? 'Pressista' : 'Carrellista'}
                    </h2>
                </div>
                <div className="relative rounded-xl overflow-auto shadow-inner">
                    <div className="shadow-sm overflow-hidden my-8">
                        <table 
                            id="gest-on-table" 
                            className="border-collapse table-auto w-full text-sm"
                        >
                            <TableHeader 
                                style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400"
                                type={safeType} 
                                primary={primary} 
                                admin={admin}
                            />
                            
                            {/* BALLE IN LAVORAZIONE */}
                            {primary ? (
                                <TableContent 
                                    key={`${safeType}-primary-regular`}
                                    type={safeType} 
                                    handleSelect={(sel, idU) => tableContent.handleSelect(sel, idU)}
                                    selectedBaleId={tableContent.selectedBaleId}
                                    add={tableContent.objAdd}  
                                    useFor={safeType === "wheelman" ? "reverse" : "regular"}
                                    noData={(e) => tableContent.noData(e)} 
                                    primary={primary}
                                    admin={admin}
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400" 
                                />
                            ) : (
                                <TableContent 
                                    key={`${safeType}-secondary-regular`}
                                    type={safeType} 
                                    useFor={safeType === "presser" ? "reverse" : "regular"}
                                    add={tableContent.objAdd} 
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400"
                                />
                            )}

                            {/* BALLE COMPLETATE */}
                            {primary ? (
                                <TableContent 
                                    key={`${safeType}-primary-specific`}
                                    type={safeType} 
                                    handleSelect={(sel, idU) => tableContent.handleSelect(sel, idU)}
                                    selectedBaleId={tableContent.selectedBaleId} 
                                    useFor={"specific"}
                                    noData={(e) => tableContent.noData(e)} 
                                    primary={primary}
                                    admin={admin}
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400"
                                />
                            ) : (
                                <TableContent 
                                    key={`${safeType}-secondary-specific`}
                                    type={safeType} 
                                    useFor={"specific"} 
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400"
                                />
                            )}          
                        </table>
                    </div>
                </div>
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
            </div>
        </div>
    )
}

TableWrapper.propTypes = {
    admin: PropTypes.bool,
    tableContent: PropTypes.shape({
        handleSelect: PropTypes.func.isRequired,
        selectedBaleId: PropTypes.string,
        objAdd: PropTypes.object.isRequired,
        noData: PropTypes.func.isRequired
    }).isRequired,
    type: PropTypes.oneOf(['presser', 'wheelman', 'both', 'admin']).isRequired,
    primary: PropTypes.bool,
};

export default TableWrapper;