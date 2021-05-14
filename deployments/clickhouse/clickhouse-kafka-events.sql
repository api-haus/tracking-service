CREATE TABLE default.events_kafka
(
    date       Date,
    date_time  DateTime,
    event_id   String,
    tracker_id String,
    ip         String,
    user_id    String,
    user_agent String,
    url        String,
    value      String
) ENGINE = Kafka
      SETTINGS kafka_broker_list = 'kafka:9092',
          kafka_topic_list = 'tracker.events',
          kafka_group_name = 'clickhouse',
          kafka_format = 'JSONEachRow';
