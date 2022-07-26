<h3 align="center">
  <img alt="Lovepets" title="Lovepets" src=".github/logo.svg" height="100px" width="100px"/>
</h3>

<h2 align="center">
 Love Pets: amor aos animais 
</h2>

<h3 align="center">
  Aplicação para conectar pessoas que desejam doar e ou adotar pets
</h3>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0-brightgreen">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Jefferson00/lovepetswebbeta">
  <a href="https://www.linkedin.com/in/jefferson-c-silva-aa1b7b1a9/">
    <img alt="Made by Jefferson" src="https://img.shields.io/badge/made%20by-Jefferson-blue">
  </a>
</p>
<p align="center" id="insomniaButton">
  <a href="https://insomnia.rest/run/?label=Lovepets&uri=https%3A%2F%2Fgithub.com%2FJefferson00%2FlovepetsAPIBeta%2Fblob%2Fmaster%2FInsomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

<p align="center">
  <img src=".github/preview.png">
</p>

## 💻 Projeto

Love pets: amor aos animais, é um projeto que tem como ideia conectar pessoas que desejam adotar ou doar pets baseado na localidade do usuário. Esse é o backend da aplicação.

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [JSONWebToken](https://github.com/auth0/node-jsonwebtoken#readme)


## ℹ️ How To Use

Importante ter instalado:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) ou [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

Import the `Insomnia.json` on Insomnia App or click on [Run in Insomnia](#insomniaButton) button

```bash
# Clone this repository
$ git clone https://github.com/Jefferson00/lovepetsAPIBeta

# Go into the repository
$ cd lovepetsAPIBeta

# Install dependencies
$ yarn install

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment


# Create the ormconfig.json file
$ {
  "type": "postgres",
  "host": "localhost",
  "port": 5434,
  "username": "postgres",
  "password": "docker",
  "database": "love_pets_beta",
  "entities": [
    "./src/modules/**/entities/*.ts"
  ],
  "migrations": [
    "./src/shared/infra/database/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/shared/infra/database/migrations/"
  }
}

# Create the instance of postgreSQL using docker

$ docker run --name lovepets-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=love_pets_beta -e POSTGRES_PASSWORD=docker \
              -p 5434:5432 -d postgres

# Create the instance of redis using docker
$ docker run --name lovepets-redis -p 6379:6379 -d -t redis:alpine

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# To finish,run
$ yarn dev

```

## 📝 License

<a href="/LICENSE">
    <img alt="Made by Jefferson" src="https://img.shields.io/badge/licence-MIT-blue">
 </a>

Made with ♥ by Jefferson C Silva :wave: [Get in touch!](https://www.linkedin.com/in/jefferson-c-silva)