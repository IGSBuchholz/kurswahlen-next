import React, {useEffect, useState} from "react";
import SelectableElement from "./SelectableElement";

const SelectableRoster = ({ items, onSelectionChange, standardvalue }) => {
    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (id) => {
        if (id !== selectedId) {
            setSelectedId(id);
            if (onSelectionChange) {
                const selectedItem = items.find((item) => item.value === id);
                onSelectionChange(selectedItem);
            }
        }
    };

    useEffect(() => {
        if(standardvalue) {
            if(standardvalue != "") {
                handleSelect(standardvalue)
            }
        }
    }, []);

    return (
        <div className="flex flex-col space-y-4">
            {items.map((item) => {
                return <SelectableElement
                    key={item.value}
                    text={item.displayText}
                    isActive={!item.disabled}
                    isSelected={selectedId === item.value}
                    infoButton={!!item.info}
                    onClick={() => handleSelect(item.value)}
                />
            })}
        </div>
    );
};

export default SelectableRoster;
