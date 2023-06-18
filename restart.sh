#!/bin/sh

docker stop fetchRepoTrafficData && docker rm fetchRepoTrafficData
docker run -v /etc/localtime:/etc/localtime --name fetchRepoTrafficData --network userDefined -d fetch-repo-traffic-image
