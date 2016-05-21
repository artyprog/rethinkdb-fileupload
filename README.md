# File Upload Demo with Socket.io, RethinkDB, AngularJS

## Features

- File transfer with Socket.io
- File upload progress
- Files stored in RethinkDB in chunks
- Thinky.io as ORM

## Requirements

- Node.js v6.x


## Setup

1. **Install**
  ```
  git clone https://github.com/hassansin/rethinkdb-fileupload.git
  npm install
  npm install -g gulp
  bower install
  ```
  Update `RETHINKDB_HOST` in `server/config.js`.

2. **Run in development mode**

  ```
  gulp watch
  ```

3. **Build and Run in production mode**

  ```
  gulp build
  npm start
  ```

