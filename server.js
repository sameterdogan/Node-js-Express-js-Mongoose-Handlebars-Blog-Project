const app = require('./app')


const { PORT } = process.env

app.listen(PORT, (err) => {
    if (err) console.log('server failed to start')
    console.log(`server started port: ${PORT} mod: ${process.env.NODEENV}`)
})
