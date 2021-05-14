CREATE TABLE trackers
(
    id    bigserial PRIMARY KEY,
    uuid  uuid DEFAULT gen_random_uuid(),
    value character varying(32) NOT NULL
);

INSERT INTO trackers
VALUES (DEFAULT, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'value-1');
INSERT INTO trackers
VALUES (DEFAULT, '40c0981a-d18d-4410-ac16-c54b06472295', 'value-2');
INSERT INTO trackers
VALUES (DEFAULT, '2da283ec-f7e5-4c6d-948c-0a98cd38b726', 'value-3');
INSERT INTO trackers
VALUES (DEFAULT, '38b7e177-93c5-4e52-8d4f-7f14b3a82c8d', 'value-4');
INSERT INTO trackers
VALUES (DEFAULT, 'fe1867b0-7246-4c3c-91d8-53f7b1119aec', 'value-5');
