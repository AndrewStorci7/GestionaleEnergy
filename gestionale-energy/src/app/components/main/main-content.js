'use client';

// import { useState } from "react";
import SearchInput from "./search/search";
import AddBale from "./add-new-bale";
import Table from "./table/table";

export default function MainContent({ type }, props ) {

    return(
        <div 
            {...props}
        >
            <SearchInput type={type} />
            <Table 
                type={type}
            />
            <AddBale />
        </div>
    );
}