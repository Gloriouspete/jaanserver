require('dotenv').config()
const Executor = require ('sqlexecutor');
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD

const executor = new Executor({
    host:"localhost",
    user:"apollomo_jaan",
    password:password,
    database:"apollomo_jaan",
}).call

module.exports = executor;