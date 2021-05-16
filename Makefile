
build:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.tracing.yml \
		-f docker-compose.artillery.yml \
		build

down:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.tracing.yml \
		-f docker-compose.artillery.yml \
 		down

db-init:
	docker compose \
		run db-init

db-shell:
	docker compose \
		run --entrypoint ash \
		db-init

dev: build down kafka db-init
	docker compose \
		run tracker \
		npx nodemon

tdd: build down kafka db-init
	docker compose \
		run tracker \
		npm test -- -w

test: build down kafka db-init
	docker compose \
		run tracker \
		npm test -- --fail-fast

kafka:
	docker compose \
		up -d kafka

server: kafka db-init
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.tracing.yml \
		up -d tracker

tracing:
	docker compose \
		-f docker-compose.tracing.yml \
		up -d

artillery:
	docker compose \
		-f docker-compose.yml \
		-f docker-compose.artillery.yml \
		run artillery -- deployments/artillery/track.yml

profile: build down tracing server artillery
