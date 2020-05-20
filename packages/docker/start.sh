#!/usr/bin/env bash

PROJECT=docere
# CONTAINERS=$(docker ps -aq -f "name=$PROJECT*")
CONTAINERS=$(docker ps -aq)

docker stop $CONTAINERS
docker rm $CONTAINERS


if [[ -z "${DEV_ENV}" ]]; then
	docker-compose -p $PROJECT -f ./packages/docker/docker-compose-prod.yml up --build -d
else
	docker-compose -p $PROJECT -f ./packages/docker/docker-compose-dev.yml up --build -d
fi
