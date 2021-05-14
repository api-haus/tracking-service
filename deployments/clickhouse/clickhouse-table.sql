CREATE TABLE default.tracking_events
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
)
    ENGINE = MergeTree PARTITION BY toYYYYMM(date) ORDER BY (tracker_id) SETTINGS index_granularity = 8192;
