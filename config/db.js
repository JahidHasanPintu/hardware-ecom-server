const Pool = require("pg").Pool;

const pool= new Pool({
    user: "postgres",
    host: "localhost",
    database: process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port: 5432,
});

module.exports= pool;