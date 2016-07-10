#!/usr/bin/env bash

docker-machine start default
eval $(docker-machine env default)
docker build -t kafka-nodejs-demo .
docker images
docker run -d kafka-nodejs-demo
docker ps
