import { Document, Page, View, Image, Text, StyleSheet, PDFDownloadLink, Canvas } from '@react-pdf/renderer';
import {sortHours} from "@/components/HoursPreview";
import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import {nameFromEmail} from "@/app/userarea/dashboard/page";

export const ExportAsPDFButton = ({hours, context, categorysort, studentname, classname, lines}) => {
    const [session, setSession] = useState(null);
    const [fullName, setFullName] = useState("");

    return <PDFDownloadLink className="rounded-xl bg-blue-500 px-6 py-2 mx-auto flex justify-center mb-4 text-white" document={<PdfDocument hours={hours} categorysort={categorysort} studentname={studentname} classname={classname} context={context} lines={lines}/>} fileName={studentname.split(' ')[0] + "_" + studentname.split(' ')[1] + "_courses.pdf"}>
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
    text_bold: {
        fontWeight: 'bold',
    },
});


const parseLine = (line = "", context, hours, studentname, klasse, categorysort) => {
    console.log("line", line)
    let styling = styles.text_title
    if(line.includes("_")) {
        let st_config = line.split("_")
        switch (st_config[0]) {
            case "title":
                styling = styles.text_title
                break;
            case "heading":
                styling = styles.text_heading
                break;
            case "bold":
                styling = styles.text_bold
                break;
        }
    }

    if(line.includes("$kurse$")) {
        return <CourseTable key={"courses_asdasd"} hours={hours} categorysort={categorysort}></CourseTable>
    }

    let hoursMap = new Map();
    hours.forEach   (hour => {
        hoursMap.set(hour.subject, hour)
    })

    if(line.includes("$")) {
        line = line.replaceAll("$schuelername$", studentname).replaceAll("$klasse$", klasse);
        const placeholderRegex = /\$(.*?)\$/g;
        line = line.replace(placeholderRegex, (match, path) => {
            console.log("match", match, path);
            console.log(context.get(path))
            if(context.has(path)) {
                console.log("Subject", context.get(path).subject)
                return context.get(path).displayText;
            }
            return <Text>"undefined"</Text>;
        });
    }
    console.log("outputline", line)
    return <Text key={"_" + line} style={styling}>{line}</Text>


}

const PdfDocument = ({hours, categorysort, studentname, classname, lines, context}) => {
    if (!hours) {
        return (
            <Document>
                <Page style={styles.page}>
                </Page>
            </Document>
        );
    }
    console.log("CategorySort", categorysort)

    return (
        <Document>
            <Page style={styles.page}>
                { lines.map( (line, index) => (
                    parseLine(line, context, hours, studentname, classname, categorysort)
                ))}
            </Page>
        </Document>
    );


}

const CourseTable = ({hours, categorysort}) => {
    console.log("HOURS", hours)
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
        {sortHours(hours, categorysort, true).map((hour, index) => (
            <HoursElement key={index} hour={hour} />
        ))}
    </View>
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
