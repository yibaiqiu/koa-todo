'use strict';

const router = require('koa-router')();

// get /
router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Hello koa2!</h1>';
});

module.exports = router;
