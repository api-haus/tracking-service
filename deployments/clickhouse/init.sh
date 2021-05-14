#!/bin/sh

apk add --no-cache curl

# initialize clickhouse
cat "./clickhouse-table.sql" | curl "${CLICKHOUSE}" --data-binary @-
cat "./clickhouse-kafka-events.sql" | curl "${CLICKHOUSE}" --data-binary @-
cat "./clickhouse-kafka-mv.sql" | curl "${CLICKHOUSE}" --data-binary @-
