import { Document, Page, View, Image, Text, StyleSheet, PDFDownloadLink, Canvas } from '@react-pdf/renderer';

export const ExportAsPDFButton = ({hours, categorysort, studentname, classname, lines}) => {
    return <PDFDownloadLink className="rounded-xl bg-blue-500 px-6 py-2 mx-auto flex justify-center mb-4" document={<PdfDocument hours={hours} categorysort={categorysort} studentname={studentname} classname={classname} lines={lines}/>} fileName={studentname.split(' ')[0] + "_" + studentname.split(' ')[1] + "_courses.pdf"}>
        {({ blob, url, loading, error }) =>
            loading ? 'PDF wird erstellt...' : 'Als PDF herunterladen'
        }
    </PDFDownloadLink>
}

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontSize: 10,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCellHeader: {
        margin: 5,
        padding: 5,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flex: 1,
    },
    tableCell: {
        margin: 5,
        padding: 5,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    text_heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#3298db',
    },
    text_title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
});

const parseFileLayout = (layout, context, hours, studentname, klasse) => {




}

const parseLine = (line = "", context, hours, studentname, klasse) => {
    console.log("line", line)
    let styling = ""
    if(line.includes("_")) {
        let st_config = line.split("_")
        switch (st_config[0]) {
            case "title":
                styling = styles.text_title
                break;
            case "heading":
                styling = styles.text_heading
                break;
        }
    }

    if(line.includes("$kurse$")) {
        return <CourseTable hours={hours}></CourseTable>
    }

    let hoursMap = new Map();
    hours.forEach(hour => {
        hoursMap.set(hour.subject, hour)
    })

    if(line.includes("$")) {
        line = line.replaceAll("$schuelername$", studentname).replaceAll("$klasse$", klasse);
        const placeholderRegex = /\$(.*?)\$/g;
        line = line.replace(placeholderRegex, (match, path) => {
            // Fetch the value from the `values` object dynamically
            if(hoursMap.has(match)) {
                return hours.get(match).subject;
            }
            return <Text>"undefined"</Text>;
        });
    }
    console.log("outputline", line)
    return <Text style={styling}>{line}</Text>


}

const PdfDocument = ({hours, categorysort, studentname, classname, lines, context}) => {
    console.log("LINES", lines)
    if (!hours) {
        return (
            <Document>
                <Page style={styles.page}>
                    <Text>NO DATA</Text>
                </Page>
            </Document>
        );
    }



    return (
        <Document>
            <Page style={styles.page}>
                { lines.forEach( (line) => {
                    return parseLine(line, context, sortHours(hours, categorysort), studentname, classname)
                })}
            </Page>
        </Document>
    );


}

const CourseTable = ({hours}) => {
    return <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Fach</Text>
            <Text style={styles.tableCellHeader}>PFach</Text>
            <Text style={styles.tableCellHeader}>12 I</Text>
            <Text style={styles.tableCellHeader}>12 II</Text>
            <Text style={styles.tableCellHeader}>13 I</Text>
            <Text style={styles.tableCellHeader}>13 II</Text>
            <Text style={styles.tableCellHeader}></Text>
        </View>

        {/* Data Rows */}
        {sortHours(hours).map((hour, index) => (
            <HoursElement key={index} hour={hour} />
        ))}
    </View>
}

function sortHours(hours, categorysort) {
    return hours.sort((a, b) => {
        const parsePosition = (pos) => {
            if (!pos) return ["", 0];
            const [letter, num] = pos.split("_");
            return [letter || "", parseInt(num || 0, 10)];
        };

        const [letterA, numA] = parsePosition(a.displayPosition);
        const [letterB, numB] = parsePosition(b.displayPosition);

        const letterIndexA = categorysort.indexOf(letterA);
        const letterIndexB = categorysort.indexOf(letterB);

        if (letterIndexA !== letterIndexB) {
            return letterIndexA - letterIndexB;
        }

        return numA - numB;
    });
}

function HoursElement({ hour }) {
    const displayPositionToDisplay = hour.displayPosition
        ? hour.displayPosition.split("_")[0]
        : "";

    return (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{hour.displayName}</Text>
            <Text style={styles.tableCell}>{hour.pfachText}</Text>
            <Text style={styles.tableCell}>
                {hour.semester.includes(1) ? hour.hours : ""}
            </Text>
            <Text style={styles.tableCell}>
                {hour.semester.includes(2) ? hour.hours : ""}
            </Text>
            <Text style={styles.tableCell}>
                {hour.semester.includes(3) ? hour.hours : ""}
            </Text>
            <Text style={styles.tableCell}>
                {hour.semester.includes(4) ? hour.hours : ""}
            </Text>
            <Text style={styles.tableCell}>{displayPositionToDisplay}</Text>
        </View>
    );
}
