'use client';

// import { useState } from "react";
import SearchInput from "./search/search";
import AddBale from "./add-new-bale";
import Table from "./table/table";
import BtnWheelman from "./btn-wheelman";
import { useState } from "react";

/**
 * 
 * @param {string} type     [ 'presser' | 'wheelman' | 'both' | 'admin' ] 
 * @param {*} props 
 * @returns 
 */
export default function MainContent({ type, implant, idUser, ...props}) {

    const [addWasClicked, setState] = useState(false)
    const [response, setResp] = useState([])

    const addHandle = (resp) => {
        setState(true)
        setResp(resp)
    }

    return(
        <div 
            {...props}
        >
            <SearchInput type={type} />
            <Table 
                type={type}
                add={addWasClicked}
                dataNew={response}
            />
            {(type === 'presser') ? (
                <AddBale 
                    implant={implant}
                    idUser={idUser}
                    clickAddHandle={addHandle}
                />
            ) : (type === 'wheelman') ? (
                <BtnWheelman/>
            ) : null
            }
        </div>
    );
}