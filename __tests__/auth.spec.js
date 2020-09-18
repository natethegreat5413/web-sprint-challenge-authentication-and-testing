const supertest = require('supertest')

const server = require('../api/server')
const db = require('../database/dbConfig')

describe('endpoints', () => {
    describe('POST /register', () => {

        beforeEach(async () => {
            await db('users').truncate();
          });

        it('should return 404 when passed incorrect data', () => {
            return supertest(server)
                .post('/apiwa/register')
                .send({ username: 'Jake', password: 'pass' })
                .end(function(err, res){
                    expect(res.statusCode).toBe(404)
                    expect(res.body.username).toBe("Nate")
                })  
            })
        it('returns a JSON object', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({ "username": "Chase", "password": "pass" })
                .then(res => {
                    expect(res.type).toEqual("application/json")
                    expect(res.status).toEqual(201)
                })
        })    
    })
    describe('POST /login', () => {
        it('should return the user if valid', () => {
            return supertest(server)
                .post('/api/login')
                .send({ username: 'Jake' })
                .end(function(err, res){
                    expect(res.body.username).toBe('Jake')
                    expect(res.status).toBe(200)
                })
        })
        beforeAll((done) => {
            supertest(server)
            .post('/api/login')
            .send({
                username: 'colby',
                password: 'pass',
            })
            .end((err, res) => {
                token = res.body.token;
                done()
            })
        })
        it('should require authorization', () => {
            return supertest(server)
            .post('/api/login')
            .then(res => {
                expect(res.status).toBe(404)
            })
        })
        
    })
})