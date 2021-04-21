const request = require('supertest')
const userModel = require('../../models/user')
const app = require('../../app')
const agent = request.agent(app)
const baseUrl = '/api/blogs/'

const addBlogObje = {
    _id: '5e302a5a97b9c9f7b219004a',
    blogTitle: 'test title',
    blogSummary: 'aLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta convallis massa',
    blogContent: 'aLorem ipsum dolor sit amet, consectetur adipiscing elit.' +
        ' Quisque porta convallis massa eu tincidunt. Maecenas tempor ut justo a condimentum.' +
        ' Donec eu velit in dui accumsan scelerisque non et libero. Proin nunc augue, auctor nec lectus' +
        ' ut, porttitor facilisis urna. Praesent dignissim felis posuere viverra maximus. Ut mollis ' +
        'libero ac ante imperdiet, eget fermentum lorem elementum.' +
        ' Nullam at felis ante. Duis dictum ipsum a diam tincidunt ullamcorper.',
    category: '6051335f8f94c53318eb13a8',
    blogImage: 'C:\\Users\\dell\\OneDrive\\Masaüstü\\auth.PNG',
}
const updateBlogObje = {
    blogTitle: 'test başarılı yazının başlığı güncellendi.',
    blogSummary: 'test başarılı yazının özeti güncellendi',
    blogContent: 'test başarılı yazının içeriği güncellendi' +
        'test başarılı yazının içeriği güncellendi' +
        'test başarılı yazının içeriği güncellendi ',
    category: '605133668f94c53318eb1324',
    blogImage: 'C:\\Users\\dell\\OneDrive\\Masaüstü\\foto1.PNG',
}

test('get  blogs', async () => {
    await request(app).get('/api/blogs').expect(200)
})

describe('login required blog process describe', () => {
    beforeAll(async () => {
        console.log('giriş yapıldı')
        const res = await agent
            .post('/auth/login')
            .send({
                email: 'testadmin@testadmin.com',
                password: 'testadmin1234',
            })
    })

    //giriş yapan kullanıcın admin olması gerekiyor
    /*  test("get all blogs",async ()=>{
          console.log("bütün bloglar getirildi");
          await agent.get("/api/blogs/allBlogs").
          expect(200)

      });*/

    test('add blog', async () => {
        await agent.post(baseUrl)
            .field('_id', addBlogObje._id)
            .field('blogTitle', addBlogObje.blogTitle)
            .field('blogSummary', addBlogObje.blogSummary)
            .field('blogContent', addBlogObje.blogContent)
            .field('category', addBlogObje.category)
            .attach('blogImage', addBlogObje.blogImage)
            .expect(200)
    })

    test('update blog', async () => {
        await agent
            .put(`${baseUrl}${addBlogObje._id}`)
            .field('blogTitle', updateBlogObje.blogTitle)
            .field('blogSummary', updateBlogObje.blogSummary)
            .field('blogContent', updateBlogObje.blogContent)
            .field('category', updateBlogObje.category).attach('blogImage', updateBlogObje.blogImage)
            .expect(200)
    })

    test('like or undo like blog', async () => {
        await agent
            .get(`${baseUrl}${addBlogObje._id}/likeOrUndoLike`)
            .expect(200)
    })

    test('delete blog', async () => {
        await agent
            .delete(`${baseUrl}${addBlogObje._id}`)
            .expect(200)
    })

})





