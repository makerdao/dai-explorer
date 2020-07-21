## SAI UI Explorer

1) npm install

2) npm start


## Docker

#### Build image
```
$ docker build -t dai-explorer:latest .
```

#### Deploy container
```
$ docker run -d -p 127.0.0.1:8080:5000/tcp dai-explorer:latest
```
