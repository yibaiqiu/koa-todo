`use strict`;

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require('koa-logger') ;

const controller = require('./controller');

const app = module.exports = new Koa();

//log middleware
//app.use(logger());

//在router之前引入bodyPaeser
app.use(bodyParser());
app.use(controller());

if(!module.parent){
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => { console.log(`App started at port ${PORT}...`); });    
}
