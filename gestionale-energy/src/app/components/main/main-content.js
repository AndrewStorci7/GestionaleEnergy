'use client';

// import { useState } from "react";
import SearchInput from "./search/search";
import AddBale from "./add-new-bale";
import Table from "./table/table";

/**
 * 
 * @param {string} type     [ 'presser' | 'wheelman' | 'both' | 'admin' ] 
 * @param {*} props 
 * @returns 
 */
export default function MainContent({ type }, props ) {

    return(
        <div 
            {...props}
        >
            <SearchInput type={type} />
            <Table 
                type={type}
            />
            {(type === 'presser') ? (
                <AddBale />
            ) : (type === 'wheelman') ? (
                null
            ) : null
            }
        </div>
    );
}