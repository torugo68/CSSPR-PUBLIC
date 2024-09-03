<!-- read me credits: https://gist.github.com/andreasonny83/7670f4b39fe237d52636df3dec49cf3a -->

# CSSPR

![image](public/logo-branco.png)

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.v
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
10.8.1
v20.13.1
```

## Table of contents

- [CSSPR](#project-name)
- [Prerequisites](#prerequisites)
- [Server](#server)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Serving the server](#serving-the-server-in-development-mode)
    - [Running the tests](#running-the-tests)
  - [API](#api)
    - [API endpoints](#api-endpoints-test)
      - [Options](#options)
    - [Auth](#auth)
- [Client](#client)
- [Credits](#credits)
- [Authors](#authors)
- [License](#license)

# Server 
## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/LambdaMike/CSSPR-PUBLIC.git
$ cd CSSPR-PUBLIC
```

To install and set up the library, run:

```sh
$ npm install
```

Generate database with prisma

```sh
$ npx prisma db push
```

Seed database with sample data: 
(broken without old data)
```sh
$ npx ts-node prisma/seed.ts
```

Config .env: 
```sh
# .env file (example)
PORT=3001
HOST=localhost

SESSION_SECRET=secret

NODE_ENV=production
```

## Usage

### Serving the server in development mode

```sh
$ npx nodemon server.ts
```

The server will be accessible at [http://localhost:3001](http://localhost:3001) (change port on server.ts)


### Serving the server in production
Install pm2: 
```sh
$ npm install -g pm2
```
Compile and run:
```sh
$ npx tsc
$ pm2 start dist/server.js --name "csspr-server"
```

The server will be accessible at [http://localhost:3001](http://localhost:3001) (change port on server.ts)

## API

### API endpoints test

We recommend that you make http requests with [Insomnia](https://insomnia.rest/download)

```js
import '/docs/api_Insomnia.json'
```

Check all API endpoints in '/routes/index.ts'

#### Options

Review some validation settings in 'middleware/validator.ts'

Example:

```tsx
export const adminSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }), // Password implement .min(6) in production
    userId: z.number().optional(),
});

// OR
export const adminSchema = z.object({
    // ...
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }), // Some regex validation...
    // ...
});

```

#### AUTH
Make sure to change the secret used in authentication
`/server.ts`
```tsx
// passport middleware
app.use(session({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour
  }
}));
initPassport(app);
```

# Client
- ##### Check [Client](/client/README.md) README

# Nginx

When you run /client/ and /server/, they will listen on ports 3000 and 5000, respectively.
If you want the client to be on localhost/ and the server to be on localhost/api/, both on port 80 (root /), you must install nginx and configure it.

Config nginx: 
> etc/nginx/sites-available/default

```
server {
    listen 80;
    server_name localhost;

    # Serve the client application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy requests to the API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart nginx: 
```
nginx -s reload
```

## Credits

This is a fork of [CSSPR](https://github.com/RhianFelipe/ControleSistema)

## Built With

* Node (Server)
* Typescript (Server)
* Prisma ORM (Server)
* Vuejs (Client)
* Love <3

## Authors

* **Rhian Felipe** - *Original work/project* - [RhianFelipe](https://github.com/RhianFelipe)

* **Victor Marques** - *Currently developer* - [LambdaMike](https://github.com/LambdaMike)

## License

[MIT License](/LICENSE) © Victor Marques