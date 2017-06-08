`use strict`;

const Koa = require("koa");
const app = new Koa();

const PORT = 3000;

app.use(async (ctx, next) => {
  ctx.body = "<h1>Hello koa2!";
  await next();
});

app.listen(PORT);

console.log(`App started at ${PORT}...`);
