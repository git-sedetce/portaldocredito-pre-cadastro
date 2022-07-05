const pgp = require("pg-promise")();
require("dotenv").config();
// const fetch = require('node-fetch');
// const fs = require("fs");

const cache = new Map();

const db = function (dbinfo = null) { 

  try {
    const dbKey = JSON.stringify(
      'CearaCredi',
      Object.keys('CearaCredi').sort()
    );
    var params = {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_SERVER,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
    };

    if (cache.has(dbKey)) {
      return cache.get(dbKey);
    }

    const instance = pgp(params);
    cache.set(dbKey, instance);
    return instance; // //console.log('file ' + cnpj + '.json', file);
  } catch (error) {
    console.log('database', error);
    return null;
  }
};

module.exports = db;
