export function parseTables($: any, el: any): any[] {
    const scrapedData: any[] = [];
    const tableHeaders: any[] = [];

    el.each((index: number, element: any) => {
        const ths = $(element).find("th");
        $(ths).each((i: number, element: any) => {
            tableHeaders.push($(element).text().toLowerCase());
        });
        const trs = $(element).find("tr");
        trs.each((index: number, element: any) => {
            const tds = $(element).find("td");
            const tableRow = {};
            $(tds).each((i: number, element: any) => {
                // @ts-ignore
                tableRow[tableHeaders[i]] = $(element).text();
            });
            scrapedData.push(tableRow);
        });
    });
    return scrapedData;
}
