const mongoose = require('mongoose')


const dbConnect = () => {

    mongoose.connect(process.env.NODEENV == 'test' ? process.env.TESTDBCONNECT : process.env.DBCONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(res => {
        console.log('database connect successfully')
    }).catch(err => {
        console.log(err)
        console.log('database connect incorrect')
    })

}

module.exports = dbConnect
