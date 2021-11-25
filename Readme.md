# [Blockchain Store]

[![Build Status](dev)

> ### API spec.


This repo is functionality complete

# Getting started

To get the server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `node app.js` to start the local server
- Install cURL ([instructions](https://curl.se/download.html)) and run it by executing `curl`
- Run `curl --location --request POST 'localhost:5000/script/registerUser' \ --data-raw ''` to register 10 users.
- Run `curl --location --request POST 'localhost:5000/script/runscript' \ --data-raw ''` to execute the script file.

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.


## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.


## API Endpoints

* Register User API
    * this api willl register 10 users which will be used randomly to send transactions.
        * `localhost:5000/script/registeruser` 


* Run Script API
    * Running Script file for sending transactions per second
        * `localhost:5000/script/runscript` 


* Get Latest Block API
    * Get latest block from the list of all blocks
        * `localhost:5000/client/getLatestBlock` 
    

* Get No of Blocks API
    * Get a count on total no of blocks
        * `localhost:5000/client/blocknumber`


* Get Block by index API
    * Fetch the block by passing index no of block
        * `localhost:5000/client/getBlockByIndex/:Id`
<br />
