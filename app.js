const express                              = require('express')
const exphbs                               = require('express-handlebars')
const handlebars                           = require('handlebars')
const { allowInsecurePrototypeAccess }     = require('@handlebars/allow-prototype-access')
const dotenv                               = require('dotenv').config({ path: './config/env/config.env' })
const path                                 = require('path')
const flash                                = require('connect-flash')
const expressSession                       = require('express-session')
const flashMiddleware                      = require('./middlewares/libraryMiddlewares/flash/flashMidd')
const cookieParser                         = require('cookie-parser')
const passport                             = require('passport')
const errorHandling                        = require('./middlewares/error/errorHandling')
const indexRouter                          = require('./routes/pageRoutes/mainRoutes')
const apiRouter                            = require('./routes/apiRoutes/mainRoutes')
const dbConnect                            = require('./helpers/database/mongoose')


dbConnect()

const app = express()


app.engine('handlebars', exphbs({ defaultLayout: 'mainLayout', handlebars: allowInsecurePrototypeAccess(handlebars) }))
app.set('view engine', 'handlebars')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIESECRET))

app.use(expressSession(
    {
        cookie: { maxAge: parseInt(process.env.COOKIEEXPIRE) * 60 * 24 * 7 * 4 * 12 },// oturum süresi 1 yıl sonra sona erer
        resave: true,
        secret: process.env.COOKIESECRET,
        saveUninitialized: true,
    }))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(flashMiddleware)
app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/assets', express.static('assets'))
app.use('/500', (req, res, next) => {
    res.status(500).render('pages/error/500', { layout: false })
})
app.use('*', (req, res, next) => {
    return res.status(404).render('pages/error/404', {
        layout: false,
    })
})

app.use(errorHandling)

module.exports = app
