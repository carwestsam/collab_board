#!/bin/bash

docker kill cb-web-dev 2>&1

docker run --rm -d --name cb-web-dev -v $PWD/web_front:/data/web_front -v $PWD/shared_components:/data/shared_components -p 8080:8080 cb-nodejs bash -c "cd /data/web_front; npm run dev"
