export function csvJSON(csv: string): any[] {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            // @ts-ignore
            obj[headers[j]] = currentline[j];
        }

        // @ts-ignore
        result.push(obj);
    }

    return result;
}
