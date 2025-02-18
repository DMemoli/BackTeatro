# base-api-express-generator

To run project local

```
npm run dev
```

To run Production

```
npm start
```

.env (example)

```
ENV=default
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://adminTeatro:passTeatro@127.0.0.1:27017/
MONGO_DB=teatro
```

.env.development (example)

```
ENV=default
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://adminTeatro:passTeatro@127.0.0.1:27017/
MONGO_DB=teatro
```
To seed database - (First time use)

cd scripts
node populateDB.js
