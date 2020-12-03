-> docker pull postgres

docker run \
 --name postgres \
 -e POSTGRES_USER=leonardjaques01 \
 -e POSTGRES_PASSWORD=minhasenhasecreta \
 -e POSTGRES_DB=heroes \
 -p 5432:5432 \
 -d \
 postgres

docker ps

docker exec -it postgres /bin/bash

-->Cliente
docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

##----- MongoDB
docker run \
 --name mongoDB \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
 -d \
 mongo:4

-->Cliente
docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongoDB:mongoDB \
 -d \
 mongoclient/mongoclient

docker exec -it mongoDB \
mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
--eval "db.getSiblingDB('herois').createUser({user:'leonardojaques', pwd:'minhasenhasecreta', roles: [{role:'readWrite', db:'herois'}]})"
