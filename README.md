# Orkhestra


[![Build Status](https://api.travis-ci.org/jmfveneroso/orkhestra.png)](https://api.travis-ci.org/jmfveneroso/orkhestra.png)
[![Docs](http://img.shields.io/badge/docs-yard.info-blue.svg)](https://jmfveneroso.github.io/orkhestra/)

Orkhestra is a graph visualization engine.

# Getting started

The Orkhestra development stack runs on docker containers. Docker is a platform to build, ship and 
run linux containers locally or on the cloud. It is available in any major OS, so start by downloading
it [here](https://www.docker.com/) and follow the configuration steps provided by the docker team.

You can start the docker default VM by typing:

```
$ docker-machine start
$ eval $(docker-machine env default)
```

It is useful to add the second inline to the end of ~/.bash_profile to configure docker automatically whenever a bash session is started.

Start the orkhestra docker environment by typing:

```
$ docker-compose build
$ docker-compose up
```

These commands will start two docker containers. One running the rails application and the other one running Postgres SQL. You can check on the started containers by typing:

```
$ docker ps
```

The application should be running on port 8080 on the docker machine. To get the docker-machine ip run:

```
$ docker-machine ip default
```

The last command should yield something like 192.168.99.100. Now you should be able to see the first page by typing 192.168.99.100:8080 taking care to replace the first part of the url by your docker machine ip.

# Running commands inside docker containers

Many times it will be necessary to run commands inside the docker containers. To run a command inside a container type:

```
$ docker exec -it "container name" command
```

Below there are some examples:

### Running tests

```
$ docker exec -it orkhestra_web_1 rake
```

### Running database migrations

```
$ docker exec -it orkhestra_web_1 bin/rails db:migrate
```

### Seeding the database

```
$ docker exec -it orkhestra_web_1 bin/rails db:seed
```

### Accessing Postgres

```
$ docker exec -it orkhestra_herokuPostgresql_1 psql
```


# Postgres

Run these commands after accessing Postgres inside the docker container.

### Connecting to the dev database
```
\connect dev_postgres
```
### Describing all tables
```
\dt
```

### Quiting
```
\q
```


# Deployment

The application is hosted in Heroku. The deployment is done automatically whenever a new pull request is merged flawlessly into master.

### Running migrations in production

```
heroku run rake db:migrate
```
