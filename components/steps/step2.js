import SelectRoster from "@/components/SelectRoster";

export default function Step2(){
    const sp1_items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1" },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];
    const sp2_items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1" },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];
    const p3_items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1" },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];
    const p4_items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1" },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];
    const p5_items = [
        { id: 1, name: "Item 1", isSelectable: true, info: "This is item 1" },
        { id: 2, name: "Item 2", isSelectable: true, info: "This is item 2" },
        { id: 3, name: "Item 3", isSelectable: true, info: "" },
    ];

    return <>
        <h1 className={"text-xl mb-4"}><u>2. Prüfungsfächer</u></h1>
        <div className={"mt-2"}>
            <SelectRoster placeholderText={"SP1"} items={sp1_items}></SelectRoster>
        </div>
        <div className={"mt-2"}>
            <SelectRoster placeholderText={"SP2"} items={sp2_items}></SelectRoster>
        </div>
        <div className={"mt-2"}>
            <SelectRoster placeholderText={"P3"} items={p3_items}></SelectRoster>
        </div>
        <div className={"w-full mx-auto bg-gray-300 h-1 my-4 rounded-xl"}></div>
        <div className={"mt-2"}>
            <SelectRoster placeholderText={"P4 (schriftlich)"} items={p4_items}></SelectRoster>
        </div>
        <div className={"mt-2"}>
            <SelectRoster placeholderText={"P5 (mündlich)"} items={p5_items}></SelectRoster>
        </div>
    </>
}