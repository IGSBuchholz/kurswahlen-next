import React, {useEffect, useState} from "react"; 

const SelectRoster = ({items, onSelectionChange, placeholderText, standardvalue}) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Sort items so that enabled items appear before disabled ones
    const sortedItems = items.slice().sort((a, b) => {
        if (a.disabled === b.disabled) return 0;
        return a.disabled ? 1 : -1;
    });

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setDropdownVisible(false);
        if (onSelectionChange) {
            //const selectedItem = items.find((items) => items.value.toString() === item.value);
            onSelectionChange(item);
        }
    };

    useEffect(() => {
        if(items.length === 1) {
            handleItemClick(items[0]);
        }
        if(standardvalue) {
            console.log("standardvalue", standardvalue);
            if(standardvalue != "") {
                const selectedItem = items.find((items) => items.value.toString() === standardvalue);
                handleItemClick(selectedItem)
            }
        }
    }, []);

    if (items.length === 1) {
        let item = items[0];
        return <>

            <div className={"block py-2"}>
                <div className="relative inline-block text-left">
                    <h2>{placeholderText}</h2>
                </div>
                <div>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 cursor-not-allowed"
                        id="menu-button"
                        aria-haspopup="false"
                    >
                        {item.displayText}
                    </button>
                </div>
            </div>
        </>

    }

    return (
        <div className={"block py-2"}>
            <div className="relative inline-block text-left">
                <h2>{placeholderText}</h2>
                <div>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        id="menu-button"
                        aria-expanded={isDropdownVisible}
                        aria-haspopup="true"
                        onClick={toggleDropdown}
                    >
                        {selectedItem ? selectedItem.displayText : placeholderText}
                        <svg
                            className="-mr-1 size-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {isDropdownVisible && (
                    <div
                        className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none max-h-80 overflow-y-auto"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            {sortedItems.map((item, index) => {
                                //console.log(item)
                                //console.log(items.length)
                                return <button
                                    key={"Sub" + item.value + "_" + index + "_" + item.index}
                                    className={`block w-full px-4 py-2 text-left text-sm text-gray-700  focus:outline-none ${!item.disabled ? "hover:bg-gray-100" : "bg-gray-300 text-gray-700"}`}
                                    role="menuitem"
                                    tabIndex="-1"
                                    onClick={() => {
                                        if (!item.disabled) {
                                            handleItemClick(item)
                                        }
                                    }}
                                >
                                    {item.displayText}
                                </button>
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default SelectRoster;