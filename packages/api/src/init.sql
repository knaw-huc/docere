DROP DATABASE IF EXISTS docere_tmp;

CREATE DATABASE docere_tmp;

\c docere_tmp

-- CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE document (
	id SERIAL PRIMARY KEY,
	name TEXT,
	text TEXT,
	annotations TEXT, -- stringified JSON
	updated TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tag (
	id SERIAL PRIMARY KEY,
	document_id SERIAL REFERENCES document,
	name TEXT,
	start INT,		
	end INT,		
	order INT,
);

CREATE TABLE attribute (
	id SERIAL PRIMARY KEY,
	tag_id SERIAL REFERENCES tag,
	key TEXT,
	value TEXT,
);
