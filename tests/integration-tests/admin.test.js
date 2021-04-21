const request = require('supertest')
const userModel = require('../../models/user')
const app = require('../../app')
const agent = request.agent(app)
const newUserObje = {
    _id: '5e30275d141401679e3832a3',
    name: 'test test1',
    email: 'test1@test1.com',
    password: 'test1234',
}


beforeAll(async () => {
    await userModel.create(newUserObje)
})

beforeAll(async () => {
    await agent
        .post('/auth/login')
        .send({
            email: 'testadmin@testadmin.com',
            password: 'testadmin1234',
        })
})

afterAll(async () => {
    await userModel.findOneAndDelete({ _id: newUserObje._id })
})

test('user block or undo block', async () => {
    await agent
        .get(`/api/admin/${newUserObje._id}/blockOrUndoBlock`)
        .expect(200)
})


