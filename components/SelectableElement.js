import React from "react";
import Image from "next/image";

const SelectableElement = ({
                               text,
                               isActive = true,
                               isSelected = false,
                               infoButton = false,
                               onClick,
                           }) => {
    return (
        <button
            onClick={() => {
                if(isActive) {
                    onClick();
                }
            }}
            className={`flex items-center justify-between rounded-md ring-1 ring-gray-300 text-left ${
                isActive && isSelected
                    ? "bg-primarybutton text-white"
                    : isActive
                        ? "bg-white text-black"
                        : "bg-gray-300"
            }`}

        >
            <span className={"p-2"}>{text}</span>
            {infoButton && (
                <div className={"p-2 z-50"} onClick={(e) => {
                    e.stopPropagation();
                    console.log("Opening Info for " + text)
                }}>
                    <Image
                        width={20}
                        height={20}
                        src={"/static/media/button/info-button.svg"}
                        alt={"Info Knopf"}
                    />
                </div>
            )}
        </button>
    );
};

export default SelectableElement;
