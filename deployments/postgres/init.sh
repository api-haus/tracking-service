#!/bin/sh

apk add --no-cache postgresql-client

# initialize postgres
createdb "${PGDATABASE}"
cat "./pq-schema.sql" | psql
