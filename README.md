# Service auth-service-nestjs
## About the service
The authorization service is intended for use in embedded and light server systems.
The service provides JWT authorization and user management, and has the ability to easily integrate
with a nestjs backend and protection against brute force attacks.  
  
Auth-service-nestjs is not an npm library, it is a nodejs microservice. For installation, do not use the command npm i auth-service-nestjs, read the instructions below.


There are 3 roles available in the service, admin, operator and guest, admin can do everything unless the DENY_ADMIN_CHANGE_ADMIN option is set

Roles below admin cannot block users, change roles, delete/create/edit users,
but can get a list of all users. Receiving a list of users for roles below admin can be prohibited using the DENY_GET_USER_LIST option


By default, external user registration is prohibited; you can enable this with the ALLOW_USER_REGISTRATION option  

The operation of the service and an example of integration can be viewed here https://github.com/trotill/auth-service_use_example

## Example backend + frontend
https://github.com/trotill/auth-service_use_example

## Dependencies
1. tested on Ubuntu 22.04 and Docker
2. nodejs no lower than version 18
3. node-gyp
4. npm
5. sqlite3

## Installation/configuration of the service
1. git clone https://github.com/trotill/auth-service.git
2. cd auth-service
3. Copy .env.example to .env  
   In .env, adjust the variables (see description below)
4. npm install
5. public and private keys, databases are generated automatically at startup
6. Before the first launch in development mode, you need to make migrations and seeds (in production mode, this is not necessary)
   - npm run migrate
   - npm run seed

## Running in production mode
npm run start

## Running in development mode

npm run start:dev

## Running in a docker container
1. npm run docker:up (run)
2. npm run docker:down (stop)

## Сhecking functionality
1. In the .env config set SHOW_API_DOCS=1
2. Start the service
3. Go to the link http://localhost:7777/api/docs in browser. You will see swagger interactive content, here you can test any endpoint.  

## Integration into your application
An example of integration is here https://github.com/trotill/auth-service_use_example

## .env file options
### Web server port
LISTEN_HTTP_PORT=4499
### Path to the folder for keys and database
STORE_PATH=store

### DB file name
DB_PATH=auth.db

### DB name
DB_NAME=database_development

### Database user
DB_USER=develinux

### DB password
DB_PASSWORD=cnfhjcnm

### Access token lifetime
ACCESS_TIMEOUT=60s

### Access token cookie max age
ACCESS_TOKEN_COOKIE_MAX_AGE=31104000000

### Lifetime of refresh token
REFRESH_TIMEOUT=90d

### Service port from docker (proxy to LISTEN_HTTP_PORT in docker). Used only when running in a docker container.
PUBLIC_HTTP_PORT=7777

### Save the swagger file on startup in the swagger folder
SAVE_SWAGGER=1

### Show swagger API on /api/docs route. For example, at http://localhost:7777/api/docs
SHOW_API_DOCS=1

### Allow users to register themselves
#### In this mode, the register endpoint is enabled, allowing users to register themselves in the system, with a low role and blocking enabled
ALLOW_USER_REGISTRATION=0

### Deny all groups except admin from receiving a list of users
DENY_GET_USER_LIST=0

### An admin cannot change the password of another admin, block or delete any admin
DENY_ADMIN_CHANGE_ADMIN=0

### Microservices feature
#### Provides token-free access to all API users. In the .env config you need to set HEADER_X_USERS_UPDATE=1. The http header must have fields set HEADER_X_USER and HEADER_X_ROLE
HEADER_X_USERS_UPDATE=0  
HEADER_X_USER = x-login  
HEADER_X_ROLE = x-role  

## Protection against brute force attacks
### Delay in ms if login fails
BRUTE_FORCE_LOGIN_DELAY = 2000

### Interval in ms, window of the allowed number of requests for the login route
BRUTE_FORCE_LOGIN_TTL = 10000
### Allowed number of requests per interval BRUTE_FORCE_LOGIN_TTL
BRUTE_FORCE_LOGIN_LIMIT = 10

### Interval in ms, window of the allowed number of requests for a whoami route
BRUTE_FORCE_WHOAMI_TTL = 60000
### Allowed number of requests per interval BRUTE_FORCE_WHOAMI_TTL
BRUTE_FORCE_WHOAMI_LIMIT = 100000

### Interval in ms, window of the allowed number of requests for any routes by default
BRUTE_FORCE_DEFAULT_TTL = 20000
### Allowed number of requests per interval BRUTE_FORCE_DEFAULT_TTL
BRUTE_FORCE_DEFAULT_LIMIT = 10000
