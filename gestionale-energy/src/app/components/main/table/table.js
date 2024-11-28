import TableHeader from "./table-header";
import CheckButton from "../select-button";
import Icon from "../get-icon";
import TableContent from "./table-content";

export default function Table({ type }) {
    
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 gap-2 pt-[30px] relative mt-[20px] h-[60vh] overflow-y-scroll"; // inset-0 shadow-inner 
    const _CMNSTYLE_TABLE = "table-auto border-collapse border border-slate-400 w-full rounded-tl-[10px] text-left mt-[10px]"; 
    const _CMNSTYLE_LABEL = "absolute top-[-10px] font-bold text-2xl px-[15px] rounded-[5px] mt-[10px]";
    const _CMNSTYLE_SECONDARY = "bg-thirdary left-[50%] ml-[4px] opacity-50";
    const _CMN_ONLY_VIEW = <span className="text-extrabold"> <u>solo visualizzazione</u></span>
    // const text_color = (primary) ? "text-white" : "text-black";
    // const bg_style = (primary) ? 'bg-primary' : 'bg-secondary';
    // const left_fixed = (!primary) ? 'left-[50%]' : null;

    switch (type) {
        case "admin": {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Amminstratore Sviluppatore</h1> */}
                    <div className={_CMNSTYLE_DIV} style={{ boxShadow: 'inset 0 -8px 6px rgba(91, 75, 73, 0.2)' }}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={`${_CMNSTYLE_TABLE}`}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary />
                        </table>

                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY} text-black`}>
                            Carrellista
                            {_CMN_ONLY_VIEW}
                        </label>
                        <table id="gest-on-table2" className={`${_CMNSTYLE_TABLE}`}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                        </table>
                    </div>
                </>
            );
        }
        case "presser": {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Pressista</h1> */}
                    <div className={_CMNSTYLE_DIV} style={{ boxShadow: 'inset 0 -8px 6px rgba(91, 75, 73, 0.2)' }}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                        </table>
                    </div>
                </>
            );
        }
        case "wheelman": {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Carrellista</h1> */}
                    <div className={_CMNSTYLE_DIV} style={{ boxShadow: 'inset 0 -8px 6px rgba(91, 75, 73, 0.2)' }}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-secondary`}>Carrellista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"} primary />
                            <TableContent type={"wheelman"} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>
                            Pressista
                            {_CMN_ONLY_VIEW} 
                        </label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} />
                            <TableContent type={"presser"} />
                        </table>
                    </div>
                </>
            );
        }
        case 'both': {
            return(
                <>
                    {/* <h1 className={_CMNSTYLE_TITLE}>Pagina Amministratore Interno</h1> */}
                    <div className={_CMNSTYLE_DIV} style={{ boxShadow: 'inset 0 -8px 6px rgba(91, 75, 73, 0.2)' }}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary />
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                            <TableContent type={"wheelman"}/>
                        </table>
                    </div>
                </>
            );
        }
    }
}