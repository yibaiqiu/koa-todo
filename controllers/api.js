'use strict';

const router = require('koa-router')();

const HttpStatus = require('../utils/httpStatusCode');

//just for test
const todolist = require('../todo_list');

//set the api prefix
router.prefix('/api/v1');

//get tasks router
router.get('/tasks', async (ctx, next) => {
  ctx.response.type = 'application/json';
  ctx.response.status = HttpStatus.OK;
  ctx.response.body = todolist;
});

//get tasks/task_id router
router.get('/tasks/:task_id', async (ctx, next) => {
    var task_id = ctx.params.task_id;
    var result = '{"code":"task:task_not_found","msg":"task not found"}';
    var status = HttpStatus.BAD_REQUEST;

    ctx.response.type = 'application/json';
    for(let i in todolist.tasks){
        if(task_id === todolist.tasks[i].id.toString()){
            result = todolist.tasks[i];
            status = HttpStatus.OK;
            break;           
        }
    }
    ctx.response.body = result; 
    ctx.response.status = status;    
});

//post tasks (add new task)
router.post('/tasks', async (ctx, next) => {
  var new_title = ctx.request.body.title || '';

  ctx.response.type = 'application/json';

  if('' === new_title){
    //title is empty
    ctx.response.status = HttpStatus.BAD_REQUEST;
    ctx.response.body = '{"code":"task:title_is_empty","msg":"title must be not empty"}';
  }else{
    var new_id = todolist.tasks.length +1;
    var task = {
      id: todolist.tasks.length +1,
      title: new_title,
      done: false
    };
    todolist.tasks.push(task);
    ctx.response.status = HttpStatus.CREATED;
    ctx.response.body = task;
  }
});

//put tasks/task_id (modify a task)
router.put('/tasks/:task_id', async (ctx, next) => {
    var task_id = ctx.params.task_id;
    var body = '{"code":"task:task_not_found","msg":"task not found"}';
    var status = HttpStatus.BAD_REQUEST;

    ctx.response.type = 'application/json';
    for(var i in todolist.tasks){
        if(task_id === todolist.tasks[i].id.toString()){
            todolist.tasks[i].title = ctx.request.body.title;
            todolist.tasks[i].done = ctx.request.body.done;
            status = HttpStatus.ACCEPTED;
            body = todolist.tasks[i];
            break;           
        }
    }
    ctx.response.body = body; 
    ctx.response.status = status;  
});

//delete /task/task_id 
router.delete('/tasks/:task_id', async (ctx, next) => {
  var task_id = ctx.params.task_id; 

  ctx.response.type = 'application/json';
  for(var i in todolist.tasks){
      if(task_id === todolist.tasks[i].id.toString()){
          ctx.response.status = HttpStatus.OK;
          ctx.response.body = todolist.tasks.splice(i,1)[0];
          return;           
      }
  }
  ctx.response.status = HttpStatus.NO_CONTENT;
});

// delete /tasks
router.delete('/task', async (ctx, next) => {
  todolist.tasks.splice(0, todolist.tasks.length);
  ctx.response.status = HttpStatus.OK;
});

module.exports = router;
