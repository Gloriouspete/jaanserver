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

//scp /Users/glo/dumps/Dump20241122.sql root@104.167.198.12:/home/jaan/
Bjelbfh0O0S9Rj1oaNiO

