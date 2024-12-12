import TableHeader from "./table-header";
import CheckButton from "../select-button";
import Icon from "../get-icon";
import TableContent from "./table-content";
import DownloadReport from "../download-btn"
import SelectInput from "../search/select";
export default function Table({ type }) {
    
    const _CMNSTYLE_TITLE = "text-3xl font-bold";
    const _CMNSTYLE_DIV = "grid grid-cols-2 gap-2 pt-[30px] relative mt-[20px] h-[60vh] overflow-y-scroll "; // inset-0 shadow-inner 
    const _CMNSTYLE_TABLE = "table-auto border-collapse border border-slate-400 w-full rounded-tl-[10px] text-left mt-[10px] "; 
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
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={`${_CMNSTYLE_TABLE}` }>
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
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} text-white bg-primary `}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary style={{overflow:'hidden'}}/>
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
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                        <label htmlFor="gest-on-table"  className={`${_CMNSTYLE_LABEL} text-white bg-secondary`} >Carrellista</label>
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
                    <div className={`${_CMNSTYLE_DIV} shadow-lg`}>
                       {/* <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-primary`}>Pressista</label>
                        <table id="gest-on-table" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"presser"} primary />
                            <TableContent type={"presser"} primary/>
                        </table>
                        <label htmlFor="gest-on-table2" className={`${_CMNSTYLE_LABEL} ${_CMNSTYLE_SECONDARY}`}>Carrellista</label>
                        <table id="gest-on-table2" className={_CMNSTYLE_TABLE}>
                            <TableHeader type={"wheelman"}/>
                                     <TableContent type={"wheelman"}/>
                        </table>
                       */}
                       <label htmlFor="gest-on-table" className={`${_CMNSTYLE_LABEL} bg-thirdary_1 `}>Amministrazione</label>
                       <div className="grid-cols-1 bg-blue-100	mt-5 border-2 border-slate-400 ">
                         <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT PREDEFINITI</h1>
                         <div className="grid grid-cols-2 gap-1 mt-20">
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. IMPIANTO A</button>
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. TEMPI IMP A</button>
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. IMPIANTO B</button>
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. TEMPI IMP B</button>
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. IMPIANTO A e B</button>
                            <button  onClick={DownloadReport} className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2">GIOR. TEMPI IMP A e B</button>
                        </div>
                       </div>
                       <div className="grid-cols-1 bg-blue-100	 border-2 border-slate-400 mt-5">
                         <h1 className="text-center font-bold bg-blue-500 text-xl">REPORT DA FILTRI</h1>
                         <div className="grid grid-cols-3 gap-1 mt-20">
                          <p className="ml-3 mb-1.5">PERIODO</p>
                          <input className=" mb-1.5" type="date"></input>
                          <input className=" mb-1.5" type="date"></input>
                          <p className="ml-3 mb-1.5">IMPIANTO</p>
                          <SelectInput id="search-input-implants" searchFor={"implants"} />
                          <p></p>
                          <p className="ml-3 mb-1.5">TIPO PLASTICA</p>
                          <SelectInput id="search-input-plastic" searchFor={"plastic"} />
                          <p></p>
                          <p className="ml-3 mb-1.5">PESO</p>
                          <select name="peso" id="pesoid"> 
                            <option value="esempio_a">-</option>
                          </select>
                        <p></p>
                        <p className="ml-3 mb-1.5">TURNO</p>
                        <select name="turno" id="turnoid">
                            <option value="esempio_a">-</option>
                        </select>
                        <p></p>
                       <p></p>
                        <button  className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-5">VISUALIZZA</button>
                       <button  className="text-black bg-sky-50 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mt-5 ">SCARICA</button>
                            
                       </div>
                       </div>
                    </div>
                </>
            );
        }
    }
}