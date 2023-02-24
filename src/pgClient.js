const { Client } = require("pg");

const client = new Client({
  connectionTimeoutMillis: 5000,
});

module.exports = client;
