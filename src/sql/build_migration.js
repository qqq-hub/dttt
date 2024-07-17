const fs = require("fs");
const path = require("path");

const VERSION = process.argv[2];

function main() {
    if (VERSION === "all") {
        buildSqlMigrationScriptAllVersion();
    } else {
        createSqlMigrationScript(VERSION);
    }
}
function compareSemver(a, b) {
    const pa = a.split(".").map(Number); // Convert each segment to a number
    const pb = b.split(".").map(Number);

    for (let i = 0; i < 3; i++) {
        // Ensure to compare major, minor, and patch
        if ((pa[i] || 0) < (pb[i] || 0)) return -1;
        if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    }
    return 0;
}

async function buildSqlMigrationScriptAllVersion() {
    const files = fs.readdirSync("./migrations/");
    const mjsFiles = files.filter((file) => path.extname(file) === ".mjs");
    const sortedFiles = mjsFiles.sort((a, b) => compareSemver(a, b));
    const functionData = new Map();
    const orderInstructions = [];
    let id = 0;
    for (const fileName of sortedFiles) {
        const file = await parseFile(fileName);
        for (const query of file.queries) {
            if (typeof query === "function") {
                let fnName = query.name;
                if (fnName === "") {
                    fnName = `$_$query${id++}`;
                }
                const queryData = query();
                if (queryData.skip) {
                    continue;
                }
                if (!functionData.has(fnName)) {
                    orderInstructions.push(fnName);
                }
                functionData.set(fnName, queryData);
            }
        }
    }
    const content = orderInstructions
        .map((queryName) => functionData.get(queryName).query)
        .join("\n");
    fs.writeFile("./migrations/all.sql", content, "utf8", (err) => {
        if (err) {
            console.error(`Error writing to the file: ${err}`);
        }
    });
}

async function parseFile(fileName) {
    return new Promise((ok) => {
        import("./migrations/" + fileName).then((module) => {
            const migration = module.getMigration();
            ok(migration);
        });
    });
}

function createSqlMigrationScript(version) {
    import("./migrations/" + version + ".mjs")
        .then((module) => {
            const migration = module.getMigration();
            const content = migration.queries
                .map((el) => el().query)
                .join("\n");
            fs.writeFile(
                "./migrations/" + version + ".sql",
                content,
                "utf8",
                (err) => {
                    if (err) {
                        console.error(`Error writing to the file: ${err}`);
                    }
                }
            );
        })
        .catch((error) => {
            console.error("Error loading the module:", error);
        });
}

main();
