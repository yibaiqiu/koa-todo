`use strict`;

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser"); 

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
    var result = '{"code":"task:task_not found","msg":"task not found"}';
    var status = 400;

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

//post tasks (add new task)
router.post('/api/v1/tasks', async (ctx, next) => {
  var new_title = ctx.request.body.title || '';
  console.log(`Add new task: title=${new_title}`);

  ctx.response.type = 'application/json';

  if('' === new_title){
    //title is empty
    ctx.response.status = 400;
    ctx.response.body = '{"code":"task:title_is_empty","msg":"title must be not empty"}';
  }else{
    //简单实现，可能重复
    var new_id = todolist.tasks.length +1;
    var task = {
      id: todolist.tasks.length +1,
      title: new_title,
      done: false
    };
    todolist.tasks.push(task);
    ctx.response.status = 201;
    ctx.response.body = task;
  }
});

//在router之前引入bodyPaeser
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);

console.log(`App started at port ${PORT}...`);
