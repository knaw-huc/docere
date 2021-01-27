#!/usr/bin/env bash

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

PROJECT=docere
CONTAINERS=$(docker ps -aq)

if [[ -z "${DOCERE_DTAP}" ]]; then
	echo "Error: DOCERE_DTAP is undefined"
	exit 0
fi

docker stop $CONTAINERS
docker rm $CONTAINERS

cp ".env.${DOCERE_DTAP,,}" .env

docker-compose \
	-p $PROJECT \
	-f "./packages/docker/docker-compose-${DOCERE_DTAP,,}.yml" \
	up \
	-d \
	--build
