import ParsingClient from "sparql-http-client/ParsingClient";
import rdfParser from "rdf-parse";
import { open, FileHandle } from "fs/promises";
import { readdirSync, statSync } from "fs";
import { BaseQuad } from "@rdfjs/types";

console.log("\x1b[94mStarting benchmark\x1b[0m");

type Database = "virtuoso" | "graphdb" | "fuseki" //| "neo4j";
type TimerResult = { result: unknown, time: number }

//                              database   : <number of triples, how many times and mean time>
type BenchmarkResult = { [key in Database]: Map<number, { times: number, mean: number }> }

function parseTriples(fileHandle: FileHandle, filename: string): Promise<BaseQuad[]> {
    return new Promise((resolve, reject) => {
        const triples: BaseQuad[] = [];
        rdfParser.parse(fileHandle.createReadStream(), {contentType: filename.endsWith('.n3')? 'text/n3': 'application/rdf+xml'})
            .on("data", (quad: BaseQuad) => {
                triples.push(quad);                    
            })
            .on("error", async (error) => {
                console.error(error);
                await fileHandle.close();
                reject(error)
            })
            .on("end", async() => {
                console.log(`${triples.length} will be inserted`)
                await fileHandle.close();
                resolve(triples);
            })
    })
}

async function run() {
    const dirName = "data"
    const triplesFileName = "data/muninn-Dump-Latest.n3"

    const adresses = new Map<Database, String>([
        ["virtuoso", "http://localhost:8890/sparql"],
        ["graphdb", "http://localhost:7200/repositories/test"],
        ["fuseki", "http://localhost:3030/test/sparql"],
        // ["neo4j", "TDB"],
    ]);

    const clients = new Map<Database, ParsingClient>([
        ["virtuoso", new ParsingClient({ endpointUrl: adresses.get("virtuoso") as string })],
        ["graphdb", new ParsingClient({ endpointUrl: adresses.get("graphdb") as string })],
        ["fuseki", new ParsingClient({ endpointUrl: adresses.get("fuseki") as string })],
    ]);


    const files = readdirSync(dirName, { withFileTypes: true, recursive: false, encoding: "utf-8" })
        .sort((a, b) => statSync([dirName, a.name].join('/')).size - statSync([dirName, b.name].join('/')).size);

    console.log("\x1b[94mInserting the files\x1b[0m");

    const BenchmarkResult: BenchmarkResult = {
        "virtuoso": new Map(),
        "graphdb": new Map(),
        "fuseki": new Map(),
        // "neo4j": new Map(),
    }


    
    
    files.forEach(async (f) => {
        const path = [dirName, f.name].join('/');
        if (path === triplesFileName) return;

        console.log(`\x1b[94mInserting ${path}\x1b[0m`)

        const fileHandle = await open(path, 'r');
        const triples = await parseTriples(fileHandle, path);

        clients.forEach(async (client, db) => {
            console.log(`\x1b[94mInserting ${f} in ${db}\x1b[0m`)
            

            const timer = new Date().getTime();
            console.log(`INSERT DATA { ${triples.map(t => t.toString()).join(" ")} }`)
            //const result = await client.query.update();
        })

    })
}

run()