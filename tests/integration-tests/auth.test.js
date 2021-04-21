const request = require('supertest')
const app = require('../../app')
const userModel = require('../../models/user')
const agent = request.agent(app)


describe('auth describe', () => {
    afterAll(async () => {
        await userModel.findOneAndDelete({ email: 'test1@test1.com' })

    })
    test('register', async () => {
        const res = await agent
            .post('/api/auth/register')
            .send({
                name: 'test test',
                email: 'test1@test1.com',
                password: 'test1234',
            })
            .expect(200)
    })

    test('login', async () => {
        console.log('giriş yapıldı')
        const res = await agent
            .post('/auth/login')
            .send({
                email: 'test1@test1.com',
                password: 'test1234',
            })
            .expect('Location', '/')
    })

})
