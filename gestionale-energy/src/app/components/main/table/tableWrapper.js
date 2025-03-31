'use client';
import { useEffect, useState } from 'react';
import TableContent from './table-content';
import TableHeader from './table-header';

/**
 * Table Wrapper
 * @author Andrea Storci form Oppimittinetworking.com
 * @param {*} param0 
 * @returns 
 */
const TableWrapper = ({
    tableHeader = null,
    tableContent = null,
    mod,
    type,
    primary = false,
}) => {

    const [backgroundColor, setBgColor] = useState("bg-red-100 dark:bg-red-800/25");
    const [innerType, setInnerType] = useState("");

    useEffect(() => {
        // setBgColor(type === 'presser' ? "backgroundProva dark:bg-red-800/25" : "backgroundProva2 dark:bg-green-800/25");
        setBgColor(type === 'presser' ? "bgPresser dark:bg-red-800/25" : "bgWheelman dark:bg-green-800/25");
        setInnerType(type);
        
        if (!tableHeader && !tableContent) {
            console.error("TableHeader e TableContent non definiti");
        }
    }, [tableHeader, tableContent, type]);

    return (
        <div>
            <div className={`not-prose shadow-sm relative rounded-xl overflow-hidden ${backgroundColor} mt-[5px]`}>
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(133, 50, 50, 0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(129, 79, 79, 0.6),rgba(187, 74, 74, 0.5))]">
                    <h2 className='font-bold text-xl px-4 pt-[5px] text-white'>
                        Dati inseriti dal  {(innerType === 'presser') ? 'Pressista' : (innerType === 'wheelman') ? 'Carrellista' : ''}
                    </h2>
                </div>
                <div className="relative rounded-xl overflow-auto">
                    <div className="shadow-sm overflow-hidden my-8">
                        <table 
                        id="gest-on-table" 
                        className="border-collapse table-auto w-full text-sm">
                            <TableHeader 
                                style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400"
                                type={innerType} 
                                primary={primary} 
                            />
                            
                            {/* BALLE IN LAVORAZIONE */}
                            {primary ? (
                                <TableContent 
                                    type={innerType} 
                                    handleSelect={(sel, idU) => tableContent.handleSelect(sel, idU)}
                                    selectedBaleId={tableContent.selectedBaleId}
                                    add={tableContent.objAdd}  
                                    noData={(e) => tableContent.noData(e)} 
                                    primary={primary}
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400" 
                                />
                            ) : (
                                <TableContent 
                                    type={innerType} 
                                    add={tableContent.objAdd} 
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400"
                                />
                            )}

                            {/* BALLE COMPLETATE */}
                            {primary ? (
                                <TableContent 
                                    type={innerType} 
                                    handleSelect={(sel, idU) => tableContent.handleSelect(sel, idU)}
                                    selectedBaleId={tableContent.selectedBaleId} 
                                    useFor={"specific"}
                                    noData={(e) => tableContent.noData(e)} 
                                    primary={primary}
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400"
                                />
                            ) : (
                                <TableContent 
                                    type={innerType} 
                                    useFor={"specific"} 
                                    style="border-b border-slate-100 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400"
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

export default TableWrapper;