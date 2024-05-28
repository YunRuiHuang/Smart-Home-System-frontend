# frontend

## Setup Docker

```shell
docker build -t frontend .
#using the dockerfile to build a image in docker

docker run --name frontend --network sample-network -it -p 8080:80 --rm -d --restart always frontend
#set up the interface at port 3001, now you access localhost:3001/ you should see a test:"success" which means success setup the interface server

```



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
