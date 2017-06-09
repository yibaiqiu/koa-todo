`use strict`;

const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

const PORT = 3000;

//采用列表模拟数据库
var todolist = {
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
  console.log(`URL : ${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// get /
router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Hello koa2!</h1>';
});

//get tasks router
router.get('/api/v1/tasks', async (ctx, next) => {
  ctx.response.type = 'application/json';
  ctx.response.body = JSON.stringify(todolist);
});

//get tasks/task_id router
router.get('/api/v1/tasks/:task_id', async (ctx, next) => {
    var task_id = ctx.params.task_id;
    var result = '{"code":1001,"msg":"task_not_found"}';
    var status = 404;

    ctx.response.type = 'application/json';
    for(var i in todolist.tasks){
        if(task_id === todolist.tasks[i].id.toString()){
            result = JSON.stringify(todolist.tasks[i]);
            status = 200;
            break;           
        }
    }
    ctx.response.body = result; 
    ctx.response.status = status;    
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);

console.log(`App started at port ${PORT}...`);
