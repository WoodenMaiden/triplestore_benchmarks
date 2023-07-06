# Triplestore benchmark

This repo aims to compare many RDFS triplestores by their performance on a given dataset.

Tested databases are: 
- [Openlink Virtuoso 7 OSS](https://github.com/openlink/virtuoso-opensource)
- [Neo4J](https://neo4j.com/fr/) using neosemantic's [RDF plugin](https://neo4j.com/labs/neosemantics/)
- [GraphDB](https://graphdb.ontotext.com/)
- [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/)

The test are running with the [Muninn World War I](https://old.datahub.io/dataset/muninn-world-war-i) dataset. It will be downloaded automatically by the script as it exceed the max size for git.

# KPIs (Key Performance Indicators)

- Insertion time
- Query time
- Memory usage
- Disk usage
- CPU usage

# Requirements 
- docker
- docker compose
- nodejs >= 20
- the [triples](https://old.datahub.io/dataset/muninn-world-war-i/resource/7810c18b-adce-4543-9aaa-57eb1c9caef3) downloaded in the `data` folder

# Tests ran 

## Insertion


## Select all the triples

```sparql 
select ?s ?p ?o where {
    ?s ?p ?o.
} LIMIT <limit>
```

## Prepare the test
