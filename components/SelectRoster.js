import React, { useState } from "react";

const SelectRoster = ({ items, onSelectionChange, placeholderText }) => {
    const [selectedId, setSelectedId] = useState("");

    const handleChange = (event) => {
        const id = event.target.value;
        setSelectedId(id);

        if (onSelectionChange) {
            const selectedItem = items.find((item) => item.id.toString() === id);
            onSelectionChange(selectedItem);
        }
    };

    return (
        <div className="w-full max-w-md">
            <select
                id="selectRoster"
                value={selectedId}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-white rounded-md ring-2 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
                <option value="" disabled>
                    {placeholderText}
                </option>
                {items.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.displayText}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectRoster;
