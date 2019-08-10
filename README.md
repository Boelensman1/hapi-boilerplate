# hapi-boilerplate
hapi API Boilerplate with an opinionated view on project structure.

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)
- **Objection** - [http://vincit.github.io/objection.js](http://vincit.github.io/objection.js/)

## Quick Start

Clone project and install dependencies:
```bash
$ git clone https://github.com/boelensman1/hapi-boilerplate.git
$ cd hapi-boilerplate
$ npm install
```

Create local config file and modify it
```bash
$ echo jwtSecret: \'$(LC_ALL=C tr -dc 'a-zA-Z0-9'<
/dev/urandom | fold -w 32 | head -n 1)\' > config/local.yaml
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

## Plugins
- **inverse** - Inversion of Control container
https://github.com/mcordingley/Inverse.js
- **glue** - Server composer for hapi.js.
https://github.com/hapijs/glue
- **blipp** - Simple hapi plugin to display the routes table at startup.
https://github.com/danielb2/blipp
- **boom** - For HTTP-friendly error objects
https://github.com/hapijs/boom
- **good** - Hapi process monitor. It listens for events emitted by Hapi Server instances and allows custom reporters to be registered that output subscribed events.
https://github.com/hapijs/good
- **good-console** - Console reporting for Good process monitor.
https://github.com/hapijs/good-console
- **good-squeeze** - Simple transform stream for event filtering with good.
https://github.com/hapijs/good-squeeze
- **jest** - Node test utility.
    https://jestjs.io
- **supertest** - Utility to test the api's responses.
https://github.com/visionmedia/supertest
- **nodemon** - Monitor for any changes in your node.js application and automatically restart the server.
https://github.com/remy/nodemon
- **pm2** - Process monitor for production
https://pm2.io
- **eslint** - A fully pluggable tool for identifying and reporting on patterns in JavaScript.
https://github.com/eslint/eslint

## Project Structure
```
.
├── api/
|   ├── handlers/
|   |   └── status.js               * Sample handler
|   |   └── post.js                 * Sample handler with db support
|   |   └── notFound.js             * The catchall 404 handler
|   └── index.js                    * REST routes
├── config/
|   ├── default.yaml                * Server configuration
|   ├── development.yaml            * Configuration overrides for development env
|   ├── production.yaml             * Configuration overrides for production env
|   ├── test.yaml                   * Configuration overrides for test environment
├── ioc/
|   ├── create.js                   * Creates the IoC container
|   ├── createServer.js             * The server creation factory
|   ├── initKnex.js                 * The knex (database) creation factory
|   ├── initModels                  * The ORM creation factory
├── migrations/
|   ├── 20170409142333_posts.js     * A knex migration for the tables
├── models/
|   ├── baseModel.js                * The model all other models inherit from
|   ├── posts.js                    * The objection models
├── test/
|   ├── api/
|   |   ├── handlers/
|   |   |   ├── status.test.js      * Status endpoint test
|   |   |   ├── post.test.js        * Post endpoint test
|   |   |   └── notFound.test.js    * Notfound endpoint test
|   |   └── setUpServer.js          * Initializes the server for the tests
|   ├── migrations/
|   |   ├── migrations.test.js      * Test if the knex migrations run
|   └── models/
|       └── baseModel.test.js       * Tests of the base model
|       ├── initModels.js           * Initializes the models for the tests
|       └── post.test.js            * Tests of the post model
├── server.js                       * Server definition (uses the Glue plugin)
└── package.json
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
