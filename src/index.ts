import ParsingClient from "sparql-http-client/ParsingClient";

console.log("\x1b[94mStarting benchmark\x1b[0m");

type Databases = "virtuoso" | "graphdb" | "fuseki" | "neo4j";

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

