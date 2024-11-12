'use client';

import { useState } from "react";
import SearchInput from "./search";
import AddPallet from "./add-new-pallet";
import TableContent from "./table-content";

export default function MainContent( {type}, props ) {

    return(
        <div 
            {...props}
        >
            <SearchInput />
            <TableContent 
                type={type}
            />
            <AddPallet />
        </div>
    );
}