# hapi-boilerplate
hapi API Boilerplate with an opinionated view on project structure.

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)

## Quick Start

Clone project and install dependencies:
```bash
$ git clone https://github.com/boelensman1/hapi-boilerplate.git
$ cd hapi-boilerplate
$ yarn install
```

Start the server:
```bash
$ yarn run dev
```

Run tests:
```bash
$ yarn run test
```

## Plugins

- **glue** - Server composer for hapi.js.
https://github.com/hapijs/glue
- **hapi-ending** - Documentation endpoint for hapi.js.
https://github.com/desirable-objects/hapi-ending
- **blipp** - Simple hapi plugin to display the routes table at startup.
https://github.com/danielb2/blipp
- **good** - Hapi process monitor. It listens for events emitted by Hapi Server instances and allows custom reporters to be registered that output subscribed events.
https://github.com/hapijs/good
- **good-console** - Console reporting for Good process monitor.
https://github.com/hapijs/good-console
- **good-squeeze** - Simple transform stream for event filtering with good.
https://github.com/hapijs/good-squeeze
- **ava** - Node test utility.
https://github.com/avajs/ava
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
|   |   └── status.js           * Sample handler
|   |   └── notFound.js         * The catchall 404 handler
|   └── index.js                * REST routes
├── config/
|   ├── default.yaml            * Server configuration
├── test/
|   └── handlers/     
|       ├── status.test.js      * Status endpoint test
|       └── notFound.test.js    * Notfound endpoint test
├── server.js                   * Server definition (uses the Glue plugin)
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
