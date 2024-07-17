const fs = require("fs");
const path = require("path");

const t = require("./template").TEMPLATE;

function main() {
    const p = path.resolve(__dirname, "../../../src/");
    createModels(p + "/bl");
    createDabaseFiles(p + "/bl");
    createServices(p + "/bl");
    createRoutes(p);
}

function snakeToCamel(str) {
    return str
        .split("_") // Split the string by underscore
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter of each part
        .join(""); // Join all parts back into a single string
}
function snakeToCamelFirstLow(str) {
    return str
        .split("_") // Split the string by underscore
        .map((part) => part.charAt(0).toLowerCase() + part.slice(1)) // Capitalize the first letter of each part
        .join(""); // Join all parts back into a single string
}

function createDabaseFiles(path) {
    const data = `import { r, WrapDataBaseMethod } from "../db";
import {
	${t.services.map(
        (s) => `Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}Item`
    )}
} from "../schema/${t.name}";

	${t.services
        .map(
            (s) => `
export const db_${t.name}_${s.name} = WrapDataBaseMethod(
    "select common.${t.name}_${s.name}(${[
        ...(s.params.query || []),
        ...(s.params.body || [])
    ].map((el) => `$${el.name}`)});",
		Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}Item,
    r<any[]>()
);`
        )
        .join("\n")}
	`;

    fs.writeFile(`${path}/models/${t.name}.ts`, data, "utf8", (err) => {
        if (err) {
            console.error(`Error writing to the file: ${err}`);
        }
    });
}

function printType(p) {
    if (p.type === "number") {
        return `z.coerce.number({
        required_error: "${p.name} is required"
    })`;
    }
    if (p.type === "string") {
        return `z.string({ required_error: "${p.name} is required" })`;
    }
    if (p.type === "any") {
        return `z.any()`;
    }
    if (p.type === "dateString") {
        return `checkStringDate({ required_error: "${p.name} is required" })`;
    }

    if (p.type === "object") {
        return `z.object({
					${p.meta.map((el) => `${el.name}: ${printType(el)}`)}
    })`;
    }
    return p.name;
}
function createModels(path) {
    const blocks = [];
    for (const s of t.services) {
        const params = [...(s.params.query || []), ...(s.params.body || [])];
        const nameAction = `${snakeToCamel(t.name)}${snakeToCamel(s.name)}`;

        blocks.push(`export const Schema${nameAction}Item = object({
	${params.map((p) => `${p.name}: ${printType(p)}`)}
});
					
					export const Schema${nameAction} = object({
    ${s.params.query ? "query: Schema" + nameAction + "Item" : ""} 
    ${s.params.body ? "body: Schema" + nameAction + "Item" : ""} 
});

		`);
    }
    const data = `
import { object, z } from "zod";

	${blocks.join("\n")}
	`;
    fs.writeFile(`${path}/schema/${t.name}.ts`, data, "utf8", (err) => {
        if (err) {
            console.error(`Error writing to the file: ${err}`);
        }
    });
}
function createServices(path) {
    const data = `
import { z } from "zod";
import {
	${t.services.map((s) => `Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}`)}
} from "../schema/${t.name}";
import {
	${t.services.map((s) => `db_${t.name}_${s.name}`)}
} from "../models/${t.name}";

	${t.services
        .map(
            (s) => `
export function ${snakeToCamelFirstLow(t.name)}${snakeToCamel(s.name)}Service(
    app: IApp,
    params: z.infer<typeof Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}>
) {
    return db_${t.name}_${s.name}(app, params.body);
}
		`
        )
        .join("")}
	`;
    fs.writeFile(`${path}/services/${t.name}.ts`, data, "utf8", (err) => {
        if (err) {
            console.error(`Error writing to the file: ${err}`);
        }
    });
}

function insertTextBeforePattern(file, pattern, textToInsert, next) {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        // Use regex to find the position of the pattern
        const regex = new RegExp(pattern);
        const match = regex.exec(data);

        if (match) {
            // Insert text before the found pattern
            const position = match.index;
            const updatedContent =
                data.slice(0, position) + textToInsert + data.slice(position);

            // Write the new content back to the file
            fs.writeFile(file, updatedContent, "utf8", (err) => {
                if (err) {
                    console.error("Error writing the file:", err);
                } else {
                    if (next) {
                        next();
                    }
                }
            });
        } else {
            console.log("Pattern not found in the file.");
        }
    });
}
function createRoutes(path) {
    const dataFunctions = `
function _${t.name}_routes(app: Express) {
    const path = "/api/v1/data/${t.name}";
	${t.services
        .map(
            (s) => `
    app.${s.http}(
        path + "/${s.name}",
        validateResource(Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}),
        defaultHandler(${snakeToCamelFirstLow(t.name)}${snakeToCamel(
            s.name
        )}Service)
    );
		`
        )
        .join("")}
	`;

    const dataImport = ` import {
		${t.services.map((s) => `Schema${snakeToCamel(t.name)}${snakeToCamel(s.name)}`)}
    
} from "./bl/schema/${t.name}";
import {
	${t.services.map(
        (s) => `${snakeToCamelFirstLow(t.name)}${snakeToCamel(s.name)}Service`
    )}
} from "./bl/services/${t.name}";
	
	`;

    const routePath = `${path}/routes.ts`;
    insertTextBeforePattern(
        routePath,
        "function routes\\(app: Express\\) \\{",
        dataFunctions,
        () => {
            insertTextBeforePattern(
                routePath,
                "const app: IApp = application;",
                dataImport
            );
        }
    );
}

main();
