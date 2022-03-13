# SmartAC API

This application allows you to create an account while being able to deposit, transfer and withdraw from it.

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone --depth 1 https://github.com/Vectormike/smartAC
cd smartAC

```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Commands

Run the migration:

```
knex migrate:latest
```

Run the seed:

```
knex seed:run --specific=admins.ts
```

Start the server in development"

```
npm run dev
```

Run in production

```
npm run serve
```

Start up the containers

```
docker-compose up -d on the root directory of the project
```

Run Migration

```
docker exec -t -i app knex migrate:latest
```

Run Seed

```
docker exec -t -i app knex seed:run --specific=admins.ts
```

## API Documentation

To view the list of available APIs and their specifications, vist [Postman API documentation](https://documenter.getpostman.com/view/5622145/UVsHV8mc)

## Features

- **MySQL database**: [MySQL](https://www.mysql.com) object data modeling using [Knex](https://knex.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Dependency management**: with [NPM](https://npm.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
NODE_ENV=development
PORT=5000

BASE_URL_DEV=http://localhost:8000
BCRYPT_SALT=12
REFRESH_TOKEN_SECRET=hththjjkekdkkkdkd
DEVICE_SHARED_SECRET=theorem
JWT_AUTH_SECRET=kdkdkkdkk
ADMIN_PASSWORD=tehpassword$$$

DB_NAME=theorem
DB_HOST=127.0.0.1
DB_PORT=8889
DB_USERNAME=root
DB_PASSWORD=root

TEST_DB_NAME=theorem_test
TEST_DB_HOST=127.0.0.1
TEST_DB_PORT=8889
TEST_DB_USERNAME=root
TEST_DB_PASSWORD=root


DB_LOCAL_PORT=8889
DB_DOCKER_PORT=8889
```

## Project Structure

```
src\
 |--components\     # Modules for each services
 |--config\         # Database, jwt and redis configuration
 |--database\       # Migrations
 |--errors\         # Error handlers
 |--helpers\        # Helpers
 |--middlewares\    # Custom express middleware
 |--shared\         # Utility classes and functions
 |--tests\          # Unit tests
 |--app.js          # Express app
 |--server.js        # App entry point
```
