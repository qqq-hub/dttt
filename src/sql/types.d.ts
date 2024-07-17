interface SqlTable {
    query: string;
}

interface SqlFunction {
    query: string;
}

interface SqlEnum {
    query: string;
}

interface SqlMigration {
    version: string;
    queries: (() => SqlTable)[];
}
