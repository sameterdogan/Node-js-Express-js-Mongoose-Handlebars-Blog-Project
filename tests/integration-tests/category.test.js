const request = require('supertest')
const app = require('../../app')
const agent = request.agent(app)
const baseUrl = '/api/categories/'
const newCategoryObject = {
    _id: '604164c1daf6f727ac126131',
    category: 'testCategory',
}

test('get categories', async () => {
    await agent
        .get(baseUrl)
        .expect(200)
})

describe('category test describe', () => {
    //admin giriş yaptı
    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({
                email: 'testadmin@testadmin.com',
                password: 'testadmin1234',
            })
    })


    test('add category test', async () => {
        await agent
            .post(`${baseUrl}`)
            .send(newCategoryObject)
            .expect(200)
    })
    test('edit category test', async () => {
        await agent
            .put(`${baseUrl}${newCategoryObject._id}`)
            .send({ category: 'editCategory' })
            .expect(200)
    })
    test('delete category test', async () => {
        await agent
            .delete(`${baseUrl}${newCategoryObject._id}`)
            .expect(200)
    })
})
