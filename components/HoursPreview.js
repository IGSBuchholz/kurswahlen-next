import {useEffect} from "react";

function HoursPreview({hours, categorysort}){
    console.log(hours)
    if(!hours) {
       return <><h2>NO DATA</h2></>
    }

    useEffect(() => {
    }, []);

    function sortHours() {

        let sorted = hours.sort((a, b) => {
            const parsePosition = (pos) => {
                if (!pos) return ["", 0]; // Handle empty or undefined displayPosition
                const [letter, num] = pos.split("_");
                return [letter || "", parseInt(num || 0, 10)];
            };

            const [letterA, numA] = parsePosition(a.displayPosition);
            const [letterB, numB] = parsePosition(b.displayPosition);

            const letterIndexA = categorysort.indexOf(letterA);
            const letterIndexB = categorysort.indexOf(letterB);

            // Sort by letter index first
            if (letterIndexA !== letterIndexB) {
                return letterIndexA - letterIndexB;
            }

            // If letters are the same, sort by number
            return numA - numB;
        });
        console.log(sorted);
        return sorted;

    }

    return <>
        <div className="overflow-x-auto bg-white dark:bg-neutral-700">

            <table className="min-w-full text-left text-sm whitespace-nowrap">

                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        Fach
                    </th>
                    <th scope="col" className="px-6 py-4">
                        PFach
                    </th>
                    <th scope="col" className="px-6 py-4">
                        12 I
                    </th>
                    <th scope="col" className="px-6 py-4">
                        12 II
                    </th>
                    <th scope="col" className="px-6 py-4">
                        13 I
                    </th>
                    <th scope="col" className="px-6 py-4">
                        13 II
                    </th>
                    <th scope="col" className="px-6 py-4">

                    </th>
                </tr>
                </thead>

                <tbody>

                {sortHours().map((hour, index) => {
                    return <HoursElement key={index} hour={hour}></HoursElement>
                })}

                </tbody>

            </table>

        </div>

    </>
}

function HoursElement({hour}) {
    let displayPositionToDisplay = ""
    if(hour.displayPosition) {
        displayPositionToDisplay = hour.displayPosition.split("_")[0];
    }
    console.log(hour)
    return <tr key={hour.valueName + "_" + hour.subject} className="border-b dark:border-neutral-600">
        <th scope="row" className="px-6 py-4">
            {hour.displayName}
        </th>
        <td className="px-6 py-4">{hour.pfachText}</td>
        <td className="px-6 py-4">{hour.semester.includes(1) ? hour.hours : ""}</td>
        <td className="px-6 py-4">{hour.semester.includes(2) ? hour.hours : ""}</td>
        <td className="px-6 py-4">{hour.semester.includes(3) ? hour.hours : ""}</td>
        <td className="px-6 py-4">{hour.semester.includes(4) ? hour.hours : ""}</td>
        <td className="px-6 py-4">{displayPositionToDisplay}</td>
    </tr>
}

export default HoursPreview;