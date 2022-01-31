# swarm-ui

## Getting started

To create a docker image:
- `docker build -t swarm-ui .`

To run docker image:
- `docker run -d -it -p 3000:80 swarm-ui`

To get the frontend running locally:

Clone this repo
- `yarn install` to install all required dependencies
- `yarn start` to start the local server (this project uses create-react-app)


### Running app with https (Only supported on MacOS)
After building docker image and installing dependencies. Instead `yarn start` use following command:
- `yarn start-https` creates SSL certificates and then starts a local server.

Requirements:

- Node: >= 14.xx.xx

Stack:

- Typescript v4.0.3
- React v17.0.1
- Ethers v5.0.24
- @web3-react/core v6.1.1
- Rimble-ui v0.14.0
- Styled-components v5.2.1
