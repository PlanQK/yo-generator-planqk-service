# generator-planqk-service

> Generator for scaffolding new PlanQK services

## Installation

First, install [Yeoman](http://yeoman.io) and generator-planqk-service using [npm](https://www.npmjs.com) (we assume you
have pre-installed [node.js](https://nodejs.org)).

```bash
npm install -g yo
npm install -g generator-planqk-service
```

Then generate your new PlanQK service:

```bash
yo planqk-service <name>
```

## Development

Clone the repository and install its dependencies:

```bash
git clone https://github.com/PlanQK/yo-generator-planqk-service
cd yo-generator-planqk-service 
npm install
```

By using `npm link`, a global npm module is created and symlinked to you local copy. Afterwards, you'll be able to
call `yo planqk-service` to test your changes.

To revert the link operation, use `npm unlink`.

## License

Apache-2.0 | Copyright 2021-2022 StoneOne AG
