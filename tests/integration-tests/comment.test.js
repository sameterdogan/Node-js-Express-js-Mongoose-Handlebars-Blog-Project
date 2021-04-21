const request = require('supertest')
const app = require('../../app')
const UserModel = require('../../models/user')
const BlogModel = require('../../models/blog')
const agent = request.agent(app)
const newBlogObject = {
    _id: '5e302a5a97b9c9f7b219004a',
    blogTitle: 'test title',
    blogSummary: 'aLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta convallis massa',
    blogContent: 'aLorem ipsum dolor sit amet, consectetur adipiscing elit.' +
        ' Quisque porta convallis massa eu tincidunt. Maecenas tempor ut justo a condimentum.' +
        ' Donec eu velit in dui accumsan scelerisque non et libero. Proin nunc augue, auctor nec lectus' +
        ' ut, porttitor facilisis urna. Praesent dignissim felis posuere viverra maximus. Ut mollis ' +
        'libero ac ante imperdiet, eget fermentum lorem elementum.' +
        ' Nullam at felis ante. Duis dictum ipsum a diam tincidunt ullamcorper.',
    category: '6051335f8f94c53318eb1323',
    blogImage: 'image file path',
}
const newUserObject = {
    name: 'test test1',
    email: 'test1@test1.com',
    password: 'test1234',
}
const newCommentObject = {
    _id: '5e302a5a97b9c9f7b219016c',
    content: 'test yorumu',
}
let baseUrl = `/api/blogs/${newBlogObject._id}/comments/`

beforeAll(async () => {
    await UserModel.create(newUserObject)

})
beforeAll(async () => {
    await agent
        .post('/auth/login')
        .send({
            email: newUserObject.email,
            password: newUserObject.password,
        })

})
beforeAll(async () => {
    await BlogModel.create(newBlogObject)
})
afterAll(async () => {
    await BlogModel.findByIdAndDelete(newBlogObject._id)
    await UserModel.findOneAndDelete({ email: newUserObject.email })

})
test('add comment test', async () => {
    await agent
        .post(baseUrl)
        .send(newCommentObject)
        .expect(200)
})

test('like or undo like comment test', async () => {
    await agent
        .get(`${baseUrl}${newCommentObject._id}/likeOrUndoLike`)
        .expect(200)
})


test('delete comment', async () => {
    await agent
        .delete(`${baseUrl}${newCommentObject._id}`)
        .send(newCommentObject)
        .expect(200)
})


