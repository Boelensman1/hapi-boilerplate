# hapi-boilerplate

hapi API Boilerplate with an opinionated view on project structure.

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)
- **Objection** - [http://vincit.github.io/objection.js](http://vincit.github.io/objection.js/)

## Quick Start

Clone project, install dependencies and migrate the database:

```bash
$ git clone https://github.com/boelensman1/hapi-boilerplate.git
$ cd hapi-boilerplate
$ npm install
$ knex migrate:latest
```

Create local config file and modify it

```bash
$ echo jwtSecret: \'$(LC_ALL=C tr -dc 'a-zA-Z0-9' </dev/urandom | fold -w 32 | head -n 1)\' > config/local.yaml
```

Start the server:

```bash
$ npm run dev
```

Run tests:

```bash
$ npm run test
```

Or, if you want to run the tests repeatedly

```bash
$ npm run test:watch
```

## Running dev environment in docker

```bash
docker-compose up -d db
docker-compose run server init
docker-compose up -d
```

## Running in production using systemctl

For running in production, copy hapi-boilerplate.service.example to hapi-boilerplate.service and modify it to your needs. Specifically you'll have to modify lines 7, 8, 9, 12, 13

## Plugins

- **zxcvbn** - Password Strength Estimation for user passwords
  https://github.com/dropbox/zxcvbn
- **inverse** - Inversion of Control container
  https://github.com/mcordingley/Inverse.js
- **glue** - Server composer for hapi.js.
  https://github.com/hapijs/glue
- **blipp** - Simple hapi plugin to display the routes table at startup.
  https://github.com/danielb2/blipp
- **boom** - For HTTP-friendly error objects
  https://github.com/hapijs/boom
- **jest** - Node test utility.
  https://jestjs.io
- **pino** - Super fast, all natural json logger
  https://github.com/pinojs/pino
- **supertest** - Utility to test the api's responses.
  https://github.com/visionmedia/supertest
- **nodemon** - Monitor for any changes in your node.js application and automatically restart the server.
  https://github.com/remy/nodemon
- **eslint** - A fully pluggable tool for identifying and reporting on patterns in JavaScript.
  https://github.com/eslint/eslint

## Project Structure

```
.
├── api/
|   ├── handlers/
|   |   ├── notFound.js             * The catchall 404 handler
|   |   ├── post.js                 * Sample handler with db support
|   |   ├── roles.js                * Handler for creating sessions
|   |   ├── session                 * Handler for creating sessions
|   |   ├── status.js               * Sample handler
|   |   └── roles.js                * Sample handler for viewing/deleting users
|   └── index.js                    * REST routes
├── config/
|   ├── default.yaml                * Server configuration
|   ├── development.yaml            * Config overrides for development env
|   ├── local.yaml                  * Config overrides specific for this machine
|   ├── production.yaml             * Configuration overrides for production env
|   └── test.yaml                   * Configuration overrides for test env
├── ioc/
|   ├── create.js                   * Creates the IoC container
|   ├── createServer.js             * The server creation factory
|   ├── initKnex.js                 * The knex (database) creation factory
|   └── initModels.js               * The ORM creation factory
├── migrations/
|   ├── 20170408162000_role.js      * A knex migration for the tables
|   ├── 20170408162010_user.js      * A knex migration for the tables
|   ├── 20170408162030_session.js   * A knex migration for the tables
|   └── 20170409142333_posts.js     * A knex migration for the tables
├── models/
|   ├── baseModel.js                * The model all other models inherit from
|   ├── post.js                     * The objection model for posts
|   ├── role.js                     * The objection model for roles
|   ├── session.js                  * The objection model for sessions
|   └── user.js                     * The objection model for users
├── plugins/
|   ├── initAuth.js                 * Initialises the authentication plugin
|   └── initPermissions.js          * Initialises the permissions plugin
├── test/
|   ├── api/
|   |   ├── handlers/
|   |   |   ├── notFound.test.js    * Notfound endpoint test
|   |   |   ├── post.test.js        * Post endpoint test
|   |   |   ├── session.seed.js     * Session seed file for its endpoint test
|   |   |   ├── session.test.js     * Session endpoint test
|   |   |   ├── status.test.js      * Status endpoint test
|   |   |   ├── user.seed.js        * User seed file for its endpoint test
|   |   |   └── user.test.js        * User endpoint test
|   |   ├── setUpServer.js          * Initializes the server for the tests
|   |   └── setUpHandlerTest.js     * Initializes the server & runs migrations
|   ├── migrations/
|   |   └── migrations.test.js      * Test if the knex migrations run
|   ├── models/
|   |   ├── baseModel.test.js       * Tests of the base model
|   |   ├── post.test.js            * Tests of the post model
|   |   ├── role.test.js            * Tests of the role model
|   |   ├── setUpModelTest.js       * Initializes the models for the tests
|   |   ├── user.seed.yaml          * User seed file for its model test
|   |   └── user.test.js            * Tests of the user model
|   └── seedDatabase.js             * Utility function to seeds the database
├── util/
|   ├── createAdminAccount.js       * Interactively creates an admin account
|   ├── permissionsFunc.js          * Determines what user has what permissions
|   └── validateJwt.js              * Validate the javascript web token
├── .editorconfig                   * Sets editor settings like the # of spaces
├── .eslintignore                   * Determines what files should not be linted
├── .eslintrc                       * Linter settings
├── .gitignore
├── ecosystem.config.yaml           * Configuration for pm2
├── jsconfig.json                   * Supresses invalid vscode warnings
├── knexfile.js                     * Utility file that loads the knex config
├── package-lock.json
├── package.json
├── README.md                       * This file!
└── server.js                       * Server definition (uses the Glue plugin)
```

## Thanks

Based on: https://github.com/rjmreis/hapi-api

## License

The MIT License (MIT)

Copyright (c) 2015 Wigger Boelens

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
