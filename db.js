const Pool = require("pg").Pool;

const pool= new Pool({
    user: "postgres",
    host: "localhost",
    database: "hardware-ecommerce",
    password: "74688",
    port: 5432,
});

module.exports= pool;
