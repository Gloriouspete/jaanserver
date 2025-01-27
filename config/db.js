require('dotenv').config()
const Executor = require ('sqlexecutor');
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD

const executor = new Executor({
    host:"localhost",
    user:"beumapvt_jaan",
    password:password,
    database:"beumapvt_jaan",
}).call
// const executor = new Executor({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"sys",
// }).call

module.exports = executor;
