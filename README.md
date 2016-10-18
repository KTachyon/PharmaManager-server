# PharmaManager (Server)

Under development

## Tech Stack

NodeJS
Express
Sequelize
PostgreSQL

## Requirements

- PostgreSQL
- NodeJS

## Setup

1. Create a database in PostgreSQL
	* e.g. `CREATE DATABASE pharma_manager;`
2. Duplicate configuration/configuration.example.js to configuration/configuration.js and change the configuration as necessary
3. Install the dependencies and build the database:
	```bash
	npm install
	node generator/ModelGenerator.js
	```

NOTE: You need to have pg_config in your environment path
