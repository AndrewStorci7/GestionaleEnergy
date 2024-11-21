'use client';

import { useState } from "react";
import SearchInput from "./search";
import AddPallet from "./add-new-pallet";
import Table from "./table/table";

export default function MainContent({ type }, props ) {

    return(
        <div 
            {...props}
        >
            <SearchInput />
            <Table 
                type={type}
            />
            <AddPallet />
        </div>
    );
}