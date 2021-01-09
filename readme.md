# Vercel Status Express/Node.js (Typescript)

## Installation

To install all dependencies and start the local server, run the following -

```
yarn && yarn d
```

To start the server after installation, you can at anytime run any of the following commands -

```
yarn d
yarn dev
yarn develop
```

## Using the Express API

There is only one route for this project (index route) which requires the following structure -

```
domain/[github_username]/[repository_slug]

```

e.g.

```

http://localhost:3007/whatjackhasmade/wjhm-nextjs
```

## Increasing the limit rate

The core API is built as a layer on top of the GitHub REST API.

GitHub limit their API requests, where we would be able to make 30 requests until a reset in our limit.

To increase the limit rate for the API to request, we first need to create a GitHub API access token. You can do this by visiting - https://github.com/settings/tokens/new

### Scopes

We will need the following scopes from the 'Select scopes' section -

- repo:status
- repo_deployment
- public_repo

![required scopes](scopes.png?raw=true)

### Adding our token to the API requests

To add your unique token, you will need to add the value as an environmental variable on either your server or local directory.

e.g. GITHUB_TOKEN="c6564f99r3143a3578f54fba38asdasa6adf"

## TODO

- Add deploy to heroku button - https://devcenter.heroku.com/articles/heroku-button
