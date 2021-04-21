const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../../models/user')
const bcrypt = require('bcryptjs')


passport.use(new localStrategy({
        usernameField: 'email',
    },
    function(email, password, done) {

        User.findOne({ email: email }, (err, user) => {

            if (err) return done(err, false)

            if (!user) return done(null, false, 'Bu E-posta adresine kayıtlı  kullanıcı bulunmuyor.')

            if (user.block === true) return done(null, false, 'Kullanıcı engellenmiş,siteye giriş hakkı bulunmuyor.')
            //if(user.checkEmail===false) return done(null,false,"E-posta hesabını onaylamalısın.");
            bcrypt.compare(password, user.password, (err, res) => {
                if (res === true) {
                    return done(null, user, null)
                } else {
                    return done(null, null, 'Şifre eksik veya hatalı.')
                }
            })

        }).select('+password')

    },
))

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})
