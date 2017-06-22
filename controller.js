'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (dir) => {
    const router = require('koa-router')();

    //default controller directory is controllers
    let controller_dir = path.join(__dirname, (dir || 'controllers'));

    let files = fs.readdirSync(controller_dir)
                  .filter((f) => {
                      return f.endsWith('.js');
                  })
                  .forEach((f) => {
                      let r = require(path.join(controller_dir,f));
                      router.use(r.routes(), r.allowedMethods());
                  });

    return router.routes(); 
};
