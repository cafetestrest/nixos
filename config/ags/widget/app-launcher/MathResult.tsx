import { Gtk } from "astal/gtk3";
import { evaluate } from "./Math";

export const MathResult = (mathText: string) => {
    let result;
    try {
        result = evaluate(mathText);
    } catch (error) {
        // do nothing
    }

    if (!result) {
        return (<box visible={false}/>)
    }

    return (
        <box vertical>
            <label label={result} className={"math-result"} />
        </box>
    );
};

// export const MathResultWithQueryText = (mathText: string, query: string) => {
//     const characterLimitPerRow = 43; // Define character limit per row
//     const totalCharacterLimit = 111; // Define total character limit

//     // Truncate the query if it exceeds the total character limit
//     if (query.length > totalCharacterLimit) {
//         query = "..." + query.slice(-totalCharacterLimit + 3);
//     }

//     // Split the query into chunks based on the character limit per row
//     const splitTextIntoRows = (text: string, limit: number): string[] => {
//         const rows: string[] = [];
//         for (let i = 0; i < text.length; i += limit) {
//             rows.push(text.slice(i, i + limit));
//         }
//         return rows;
//     };

//     const rows = splitTextIntoRows(query, characterLimitPerRow);

//     // Create labels for each row and add them dynamically
//     const queryLabels = rows.map((rowText, index) => (
//         <label label={rowText} className={"math-query"} />
//     ));

//     // Return the final structure
//     return (
//         <box halign={Gtk.Align.CENTER} vertical>
//             <box vertical>{queryLabels}</box>
//             <label label={mathText} className={"math-result"} />
//         </box>
//     );
// };
