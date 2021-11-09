require('dotenv').config();
const { Pool } = require('pg')
const isProd = process.env.NODE_ENV === 'production';

const env = process.env;

const dbString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`;
var url = "";
if(isProd){
    url = env.DATABASE_URL;
}
else{
    url = dbString;
}

const pool = new Pool({
    connectionString: url,
    ssl: isProd,
});

module.exports = { pool };