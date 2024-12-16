import React, { useState } from "react";
import SelectableElement from "./SelectableElement";

const SelectableRoster = ({ items, onSelectionChange }) => {
    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (id) => {
        if (id !== selectedId) {
            setSelectedId(id);
            if (onSelectionChange) {
                const selectedItem = items.find((item) => item.id === id);
                onSelectionChange(selectedItem);
            }
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            {items.map((item) => (
                <SelectableElement
                    key={item.value}
                    text={item.displayText}
                    isActive={true}
                    isSelected={selectedId === item.value}
                    infoButton={!!item.info}
                    onClick={() => handleSelect(item.value)}
                />
            ))}
        </div>
    );
};

export default SelectableRoster;
