# Minnow Bot

## Installation & Setup

### Prerequisites

- [Docker](https://docs.docker.com/desktop/)
- [Node.js >= 18.20.7](https://nodejs.org/en/download) (if running locally. **Not Recommended**)

### Installation

- Clone the repository.
- Create a `config.json` file at the root of the directory.
- Copy the contents of `config.json.example` to your newly created `config.json`.
- Contact codeowners for credentials.

## Starting the application

### Docker

- Build image and run container: `docker compose up`
- Can append `--watch` for automatic rebuilds on file save: `docker compose up --watch`

### Local

- Install dependencies: `npm i`
- Run start script: `npm run start` (automatically deploys and registers bot commands)