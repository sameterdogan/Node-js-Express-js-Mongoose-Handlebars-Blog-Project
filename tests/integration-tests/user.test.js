const request = require('supertest')
const app = require('../../app')
const userModel = require('../../models/user')
const agent = request.agent(app)
const baseUrl = '/api/users/'
const newUserObje = {
    _id: '5e30275d141401679e3832a3',
    name: 'test1 test1',
    email: 'test1@test1.com',
    password: 'test1234',
}


describe('profile page,get user\'s blogs and saved blogs test describe', () => {
    let newUser
    beforeAll(async () => {
        newUser = await userModel.create({ ...newUserObje })
    })

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({
                email: newUserObje.email,
                password: newUserObje.password,
            })
    })

    afterAll(async () => {
        await userModel.findOneAndDelete({ email: newUserObje.email })
    })
    test('get profile page', async () => {
        await agent
            .get(`/users/${newUser.slugName}/profile`)
            .expect(200)

    })

    test('get user\'s blogs', async () => {
        await agent
            .get(`${baseUrl}${newUserObje._id}/blogs`)
            .expect(200)
    })
    test('get user\'s saved blogs', async () => {
        await agent
            .get(`${baseUrl}${newUserObje._id}/savedBlogs`)
            .expect(200)
    })
})

describe('edit profile page and  edit profile  test describe', () => {
    let newUser
    beforeAll(async () => {
        newUser = await userModel.create({ ...newUserObje })
    })
    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({
                email: newUserObje.email,
                password: newUserObje.password,
            })
    })
    afterAll(async () => {
        await userModel.findOneAndDelete({ email: newUserObje.email })
    })
    test('get edit profile page', async () => {
        await agent
            .get(`/users/${newUser.slugName}/editProfile`)
            .expect(200)

    })
    test('edit user profile', async () => {
        await agent
            .put(`${baseUrl}${newUserObje._id}/editProfile`)
            .field('name', 'yeni isim test !')
            .field('company', 'iş yeri değiştirildi')
            .attach('profileImg', 'C:\\Users\\dell\\OneDrive\\Masaüstü\\foto1.PNG')
            .expect(200)

    })

})

//giriş yapan kullanıcın admin olması gerekiyor!!
describe('delete user test describe', () => {

    //yeni kullanıcı oluştu
    beforeAll(async () => {
        await userModel.create({ ...newUserObje })
    })

    //admin giriş yaptı
    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({
                email: 'testadmin@testadmin.com',
                password: 'testadmin1234',
            })
    })

    test('user delete', async () => {
        await agent
            .delete(`${baseUrl}${newUserObje._id}`)
            .expect(200)
    })
})



