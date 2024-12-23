'use client';

// import { useState } from "react";
import SearchInput from "./search/search";
import AddBale from "./btn/btn-presser";
import Table from "./table/table";
import BtnWheelman from "./btn/btn-wheelman";
import { useState } from "react";

/**
 * 
 * @param {string} type     [ 'presser' | 'wheelman' | 'both' | 'admin' ] 
 * @param {*} props 
 * @returns 
 */
export default function MainContent({ type, implant, idUser, ...props}) {

    const _CMNSTYLE_DIV_EMPTY = "fixed top-0 left-0 h-screen w-screen"
    const _CMNSTYLE_EMPTY = "text-2xl w-screen h-screen flex justify-center items-center"

    const [isEmpty, setEmpty] = useState(false)
    const [msgEmpty, setMsg] = useState("")
    // const [addWasClicked, setState] = useState(false)
    // const [response, setResp] = useState([])
    
    // const addHandle = (resp) => {
    //     setState(true)
    //     setResp(resp)
    // }

    const noData = (msg) =>  {
        setEmpty(!isEmpty)
        setMsg(msg)
    }

    return(
        <div 
            {...props}
        >
            <SearchInput type={type} />
            <Table
                type={type}
                implant={implant}
                idUser={idUser}
                // add={addWasClicked}
                // emptyData={noData}
                // dataNew={response}
            />
            {/* {(!addWasClicked) ? (
                <div className={`${(isEmpty || addWasClicked) ? "visible" : "invisible"} ${_CMNSTYLE_DIV_EMPTY}`}>
                    <h1 className={`${_CMNSTYLE_EMPTY}`}>
                        {msgEmpty}
                    </h1>
                </div>
            ) : null } */}
            {/* {(type === 'presser') ? (
                <AddBale 
                    implant={implant}
                    idUser={idUser}
                    clickAddHandle={addHandle}
                />
            ) : (type === 'wheelman') ? (
                <BtnWheelman/>
            ) : null } */}
        </div>
    );
}