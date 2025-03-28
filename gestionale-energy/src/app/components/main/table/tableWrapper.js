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
        setBgColor(type === 'presser' ? "bg-red-50 dark:bg-red-800/25" : "bg-green-50 dark:bg-green-800/25")
        setInnerType(type);
        
        if (!tableHeader && !tableContent) {
            console.error("TableHeader e TableContent non definiti");
        }
    }, [tableHeader, tableContent, type]);

    return (
        <div>
            <div className={`not-prose shadow-sm relative rounded-xl overflow-hidden ${backgroundColor} mt-[5px]`}>
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(133, 50, 50, 0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(129, 79, 79, 0.6),rgba(187, 74, 74, 0.5))]">
                    <h2 className='font-bold text-xl px-4 pt-[5px]'>
                        Dati inseriti dal  {(innerType === 'presser') ? 'Pressista' : (innerType === 'wheelman') ? 'Carrellista' : ''}
                    </h2>
                </div>
                <div className="relative rounded-xl overflow-auto">
                    <div className="shadow-sm overflow-hidden my-8">
                        <table 
                        id="gest-on-table" 
                        className="border-collapse table-auto w-full text-sm">
                            <TableHeader type={innerType} primary={primary} />
                            
                            {/* BALLE IN LAVORAZIONE */}
                            {primary ? (
                                <TableContent 
                                    type={innerType} 
                                    handleSelect={(sel, idU) => tableContent.handleSelect(sel, idU)}
                                    selectedBaleId={tableContent.selectedBaleId}
                                    add={tableContent.objAdd}  
                                    noData={(e) => tableContent.noData(e)} 
                                    primary={primary} 
                                />
                            ) : (
                                <TableContent type={innerType} add={tableContent.objAdd} />
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
                                />
                            ) : (
                                <TableContent type={innerType} useFor={"specific"} />
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