# Worship Cloud ![build_status](https://travis-ci.com/rocketBANG/worship-cloud.svg?token=1evRgsqMVaUyaUvXTSsQ&branch=master)

## About
This is the frontend for the WorshipCloud webappp. The backend can be found [here](https://github.com/rocketBANG/worship-cloud-api)

## Contents
* [Setup](#setup)
* [Running](#running)

## Setup
### Enviroment setup
Create files `.env.production` and `.env` with the following lines
```
REACT_APP_API_URL=
REACT_APP_SOCKET_URL=
```
`REACT_APP_API_URL` is the url where the
    [worship-cloud-api](https://github.com/rocketBANG/worship-cloud-api) is hosted
`REACT_APP_SOCKET_URL` is base url to connect the websockets to 
    (also using worship-cloud-api)
    
`.env.production` Handles what config the program uses in a production enviroment  
`.env` Handles what the program uses in a dev enviroment

### Package setup
Install [NodeJS](https://nodejs.org/en/) if it isn't already installed  
Run the command `npm install` from the root project directory
to install all packages needed to run the program

## Running
Use the command `npm start` to start a local server at `localhost:3000`  
Changing code while the server is running will cause it to refresh automatically.

## Building
To build, use the command `npm run build`. This will create a `dist` folder with all files
    built as needed  
These files can then be hosted on a server, and served to users
