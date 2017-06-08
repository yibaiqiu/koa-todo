`use strict`;

const Koa = require("koa");

const app = new Koa();

//启动端口
const PORT = 3000;

//采用列表模拟数据库
var todolist = {
  limit: 5,
  offset:0,
  total:3,  
  tasks: [
    {
      id: 1,
      title: "learn koa",
      done: false
    },
    {
      id: 2,
      title: "design project",
      done: false
    },
    {
      id: 3,
      title: "todo project",
      done: false
    }
  ]
};

//log middleware
app.use(async (ctx, next) => {
  console.log(`URL : ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.path === "/") {
    ctx.response.type = "text/html";
    ctx.response.body = "<h1>Hello koa2!</h1>";
  } else {
    await next();
  }
});

app.use(async (ctx, next) => {
  if (ctx.request.path === "/api/v1/tasks" && ctx.request.method === "GET") {
    todolist.total = todolist.tasks.length;
    ctx.response.type = "application/json";
    ctx.response.body = JSON.stringify(todolist);
  } else {
    await next();
  }
});

app.listen(PORT);

console.log(`App started at port ${PORT}...`);
