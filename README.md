# stash

## development

### install
`npm install`*

* Node 10.4.0 supported in production

### test
ensure you have brew/postgres installed
```
brew install postgres
brew services start postgresql

createuser stash --pwprompt
createdb -O stash stash
npx knex migrate:latest
psql stash
```

`npm test`


### lint
`npm run lint`


### start server
`npm start`
