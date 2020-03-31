#!/usr/bin/env bash

PROJECT=docere
# CONTAINERS=$(docker ps -aq -f "name=$PROJECT*")
CONTAINERS=$(docker ps -aq)

docker stop $CONTAINERS
docker rm $CONTAINERS

docker-compose -p $PROJECT -f ./packages/docker/docker-compose-dev.yml up --build -d
