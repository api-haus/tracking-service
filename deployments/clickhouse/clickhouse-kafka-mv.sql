CREATE MATERIALIZED VIEW default.events_kafka_mv TO default.tracking_events
AS
SELECT *
FROM default.events_kafka;
