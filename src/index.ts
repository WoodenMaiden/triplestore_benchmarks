import ParsingClient from "sparql-http-client/ParsingClient";
import { open } from "fs/promises";
import { readdirSync, statSync } from "fs";

console.log("\x1b[94mStarting benchmark\x1b[0m");

type Databases = "virtuoso" | "graphdb" | "fuseki" | "neo4j";
type TimerResult = { result: unknown, time: number };

async function run() {
    const dirName = "data"
    const triplesFileName = "data/muninn-Dump-Latest.n3"

    const adresses = new Map<Databases, String>([
        ["virtuoso", "http://localhost:8890/sparql"],
        ["graphdb", "http://localhost:7200/repositories/test"],
        ["fuseki", "http://localhost:3030/test/sparql"],
        ["neo4j", "TDB"],
    ]);

    const clients = new Map<Databases, ParsingClient>([
        ["virtuoso", new ParsingClient({ endpointUrl: adresses.get("virtuoso") as string })],
        ["graphdb", new ParsingClient({ endpointUrl: adresses.get("graphdb") as string })],
        ["fuseki", new ParsingClient({ endpointUrl: adresses.get("fuseki") as string })],
    ]);


    const files = readdirSync(dirName, { withFileTypes: true, recursive: false, encoding: "utf-8" })
        .sort((a, b) => statSync([dirName, a.name].join('/')).size - statSync([dirName, b.name].join('/')).size);

    console.log(files);
}

run()