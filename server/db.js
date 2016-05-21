import config from "./config";
import thinky from 'thinky';

export default thinky({
  db: config.RETHINKDB_DATABASE,
  servers: [
    { host: config.RETHINKDB_HOST, port: config.RETHINKDB_PORT }
  ]
});
