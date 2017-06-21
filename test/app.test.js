'use strict';

const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest').agent(app.listen());

const HttpStatus = require('../utils/httpStatusCode');
const todolist = require('../todo_list');
const tasks = todolist.tasks;


describe('RESTful API', () => {
    describe('#API tasks', () => {

        beforeEach(() => {
            var task = {
                id: 1,
                title: "make money",
                done: false
            };
            tasks.splice(0, tasks.length);
            tasks.push(task);
        });

        it('GET /tasks OK', async () => {
            let result = await request
                    .get('/api/v1/tasks')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.OK)
                    .then((res) => {
                        expect(res.body).to.have.property('tasks');
                        expect(res.body.tasks[0]).to.have.property('id', 1);
                        expect(res.body.tasks[0]).to.have.property('title', 'make money');
                        expect(res.body.tasks[0]).to.have.property('done', false);
                    });
        });

        it('GET /tasks/task_id OK', async () => {
            let result = await request
                    .get('/api/v1/tasks/1')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.OK)
                    .then((res) => {
                        expect(res.body).to.have.property('id', 1);
                        expect(res.body).to.have.property('title', 'make money');
                        expect(res.body).to.have.property('done', false);
                    });                    
        });        

        it('GET /tasks/task_id id not exist', async () => {
            let result = await request
                    .get('/api/v1/tasks/5')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.BAD_REQUEST)
                    .then((res) => {
                        expect(res.body).to.have.property('code', 'task:task_not_found');
                        expect(res.body).to.have.property('msg', 'task not found');                     
                    });
        });

        it('POST /tasks OK', async () => {
            let result = await request
                    .post('/api/v1/tasks')
                    .send({title: 'master javascript'})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.CREATED)
                    .then((res) => {
                        expect(res.body).to.have.property('id', 2);
                        expect(res.body).to.have.property('title', 'master javascript');
                        expect(res.body).to.have.property('done', false);
                    });
        });

        it('POST /tasks title is empty', async () => {
            let result = await request
                    .post('/api/v1/tasks')
                    .send({title: ''})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.BAD_REQUEST)
                    .then((res) => {
                        expect(res.body).to.have.property('code', 'task:title_is_empty');
                        expect(res.body).to.have.property('msg', 'title must be not empty');
                    });
        });

        it('PUT /tasks/task_id OK', async () => {
            let result = await request
                    .put('/api/v1/tasks/1')
                    .send({title: 'learn koa2', done: true})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.ACCEPTED)
                    .then((res) => {
                        expect(res.body).to.have.property('id', 1);
                        expect(res.body).to.have.property('title', 'learn koa2');
                        expect(res.body).to.have.property('done', true);
                    });
        });

        it('PUT /tasks/task_id id not exist', async () => {
            let result = await request
                    .put('/api/v1/tasks/5')
                    .send({title: 'learn koa2', done: true})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.BAD_REQUEST)
                    .then((res) => {
                        expect(res.body).to.have.property('code', 'task:task_not_found');
                        expect(res.body).to.have.property('msg', 'task not found');                     
                    });
        }); 

        it('DELETE /tasks/task_id OK', async () => {
            let result = await request
                    .del('/api/v1/tasks/1')
                    .expect('Content-Type', /application\/json/)
                    .expect(HttpStatus.OK)
                    .then((res) => {
                        expect(res.body).to.have.property('id', 1);
                        expect(res.body).to.have.property('title', 'make money');
                        expect(res.body).to.have.property('done', false);                   
                    });
        });

        it('DELETE /tasks/task_id not exist', async () => {
            let result = await request
                    .del('/api/v1/tasks/5')
                    .expect(HttpStatus.NO_CONTENT);
        });                                                     

    });
});