import {useEffect, useState} from "react";


export function sortHours(hours, categorysort, debug = false) {
    console.log("HOURSTOSORT", hours)
    if(hours.length === 0){
        return [];
    }
    let sorted = hours.sort((a, b) => {

        const parsePosition = (pos) => {
            if (!pos) return ["", 0]; // Handle empty or undefined displayPosition
            const [letter, num] = pos.split("_");
            return [letter || "", parseInt(num || 0, 10)];
        };


        const [letterA, numA] = parsePosition(a.displayPosition);
        const [letterB, numB] = parsePosition(b.displayPosition);
        if(debug){
            console.log("CategorySort", categorysort);
            console.log("D1", letterA, numA);
            console.log("D2", letterB, numB);

        }
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

function HoursPreview({hours, categorysort = [], pxSize=6, pySize=4}) {
    console.log("HPreview", hours, pxSize, pySize);
    // Calculate weekly sums per semester and total qualification
    let semSums = [0, 0, 0, 0, 0];
    hours.forEach(hour => {
      (hour.semester || []).forEach(s => {
        if (semSums[s] !== undefined) semSums[s] += hour.hours;
      });
    });
    const totalQual = semSums.slice(1).reduce((sum, val) => sum + val, 0);

    if (!hours || !categorysort) {
        return <><h2>NO DATA</h2></>
    }

    return <>
        <div className="overflow-x-auto bg-white dark:bg-neutral-700">

            <table className="min-w-full text-left text-sm whitespace-nowrap">

                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600">
                <tr>
                    <th scope="col" style={{ paddingLeft: `${pxSize * 0.25}rem`, paddingRight: `${pxSize * 0.25}rem`, paddingTop: `${pySize * 0.25}rem`, paddingBottom: `${pySize * 0.25}rem` }}>
                        Fach
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>
                        PFach
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>
                        12 I
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>
                        12 II
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>
                        13 I
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>
                        13 II
                    </th>
                    <th scope="col" style={{
                        paddingLeft: `${pxSize * 0.25}rem`,
                        paddingRight: `${pxSize * 0.25}rem`,
                        paddingTop: `${pySize * 0.25}rem`,
                        paddingBottom: `${pySize * 0.25}rem`
                    }}>

                    </th>
                </tr>
                </thead>

                <tbody>

                {sortHours(hours, categorysort).map((hour, index) => {
                    return <HoursElement key={index} hour={hour} pxSize={pxSize} pySize={pySize}></HoursElement>
                })}
                <tr className="border-t font-bold">
                  <th scope="row" style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>Summe/Wochenstunden</th>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}></td>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>{semSums[1]}</td>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>{semSums[2]}</td>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>{semSums[3]}</td>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>{semSums[4]}</td>
                  <td style={{
                    paddingLeft: `${pxSize * 0.25}rem`,
                    paddingRight: `${pxSize * 0.25}rem`,
                    paddingTop: `${pySize * 0.25}rem`,
                    paddingBottom: `${pySize * 0.25}rem`
                  }}>{totalQual}</td>
                </tr>

                </tbody>

            </table>

        </div>

    </>
}



function HoursElement({hour, pxSize, pySize}) {
    let displayPositionToDisplay = ""
    if (hour.displayPosition) {
        displayPositionToDisplay = hour.displayPosition.split("_")[0];
    }
    console.log(hour)
    return <>
        <tr key={hour.valueName + "_" + hour.subject} className="border-b dark:border-neutral-600">
            <th scope="row" className="px-6 py-4">
                {hour.displayName}
            </th>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{hour.pfachText}</td>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{hour.semester.includes(1) ? hour.hours : ""}</td>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{hour.semester.includes(2) ? hour.hours : ""}</td>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{hour.semester.includes(3) ? hour.hours : ""}</td>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{hour.semester.includes(4) ? hour.hours : ""}</td>
            <td style={{
                paddingLeft: `${pxSize * 0.25}rem`,
                paddingRight: `${pxSize * 0.25}rem`,
                paddingTop: `${pySize * 0.25}rem`,
                paddingBottom: `${pySize * 0.25}rem`
            }}>{displayPositionToDisplay}</td>
        </tr>
    </>
}

export default HoursPreview;