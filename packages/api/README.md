# Docere API

## Index documents
```
$ node build/indexer.js <project_id>
```

## Launch container
```
$ docker-compose -p docere up --build -d
```

## Run tests
```
$ npx ts-node test.ts
```

## Run Swagger
```
$ docker run -p 8080:8080 swaggerapi/swagger-ui
```
And point Swagger to http://localhost:4000/swagger.yml
