"use client";

import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import SelectableElement from "@/components/SelectableElement";
import SelectableRoster from "@/components/SelectableRoster";
export default function Step1(openPopUp){

    const [selectedItem, setSelectedItem] = useState(null);

    const items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1",  },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];

    const handleSelectionChange = (item) => {
        console.log("Selected item:", item);
        setSelectedItem(item);
    };


    return <>
        <h1 className={"text-xl mb-4"}><u>1. Profil wählen</u></h1>
        <SelectableRoster items={items} onSelectionChange={handleSelectionChange} />
    </>


}

Step1.propTypes=  {
    openPopUp: PropTypes.func.isRequired,
}