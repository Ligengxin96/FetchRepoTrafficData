#!/bin/sh

docker stop fetchRepoTrafficData && docker rm fetchRepoTrafficData
docker run -v /etc/localtime:/etc/localtime --name fetchRepoTrafficData --network userDefined --ip 172.20.0.6 -d fetch-repo-traffic-image