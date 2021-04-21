const UserModel = require('../models/user')
const passport = require('passport')
const sendMail = require('../helpers/libraries/nodemailer/nodemailer')
const CustomError =require("../helpers/error/CustomError")

require('../passport/authentication/authentication')

const registerPage = (req, res, next) => {

    res.render('pages/auth/register')
}

const loginPage = (req, res, next) => {

    res.render('pages/auth/login')

}

const forgotPasswordPage = (req, res) => {

    res.render('pages/auth/forgotPassword')

}

const resetPasswordPage = (req, res, next) => {
    console.log("geldisdasdas")
     res.render('pages/auth/resetPassword', {
        forgotPasswordToken: req.query.forgotPasswordToken,
    })

}


const register = async (req, res, next) => {

    try {
        let user = await UserModel.create({ ...req.body })
        /*   const randomCode=user.getEmailCheckCode();
            await user.save();

            let checkEmailTemplate = `
              <h3>E-POSTA ONAY KODU</h3>
              <p> "<span class="text-big">${randomCode}</span>"Kodu girerek E-posta hesabını onaylayabilirsin.</p>
        `
            await sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: "E-POSTA ONAYI",
                html: checkEmailTemplate
            });

            res.redirect("/auth/check_email");*/
        req.flash('registerSuccess', 'Kayıt işlemi başarılı,giriş yapabilirsiniz.')
        res.status(200).json({
            success: true,
            toUrl: '/auth/login',
        })

    } catch (err) {
        if(err.name==="ValidationError"){
            console.log(err.errors.email.message)
          return next(new CustomError(err.errors.email.message,400))
        }
        return next(err)
    }


}

const login = (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        successFlash: true,
        failureFlash: true,

    })(req, res, next)


}

const logout = (req, res, next) => {

    req.logout()
    res.redirect('/')

}

const forgotPassword = async (req, res, next) => {
    try {
        const user = req.emailCheckedUser

        const forgotPasswordToken = user.getForgotPasswordToken()
        const resetPasswordURL = `${process.env.URL}auth/reset_password?forgotPasswordToken=${forgotPasswordToken}`
        await user.save()

        let emailHtmlTamplate = `
       <h3>ŞİFRE SIFIRLAMA BAĞLANTISI</h3>
       <p><a href='${resetPasswordURL}' target='_blank'>link  </a>  Şifrenizi sıfırlamak için bağlantıya tıklayın. </p>
       `
        await sendMail({
            from: process.env.SMTP_USER,
            to: req.body.email,
            subject: 'ŞİFRE SIFIRLAMA',
            html: emailHtmlTamplate,
        })
        return res.status(200).json({
            success: true,
            message: 'Bağlantı E-posta adresine gönderildi.',
        })

    } catch (err) {
        console.log(err)
        return next(err)
    }

}

const resetPassword = async (req, res, next) => {
    try {
        const forgotPasswordToken = req.query.forgotPasswordToken
        const password = req.body.password

        const user = await UserModel.findOne({
            forgotPasswordToken,
            forgotPasswordTokenExpire: { $gt: Date.now() },
        }).select('+password')
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Geçersiz bağlantı veya süresi dolmuş.',
            })
        }
        /*user.password=password;
        user.forgotPasswordToken=undefined;
        user.forgotPasswordTokenExpire=undefined;*/
        [user.password, user.forgotPasswordToken, user.forgotPasswordTokenExpire] = [password, undefined, undefined]
        await user.save()

        req.flash('resetPasswordSuccess', 'Şifre değiştirildi giriş yapabilirsin.')
        return res.status(200).json({
            success: true,
            toUrl: '/auth/login',
        })

    } catch (err) {
        return next(err)
    }
}


//e-posta kontrol sistemi şu an devre dışı
/*
const checkEmailSendCode=async (req,res,next)=>{
    try{
       const user=req.emailCheckedUser;
        if(user.checkEmail===true){
            return res.status(400).render("pages/checkEmailSendCode", {
                checkEmailSendCodeError: "Bu E-posta zaten onaylı."
            });
        }

        const randomCode=user.getEmailCheckCode();
        await user.save();

        let checkEmailTemplate = `
          <h3>E-POSTA ONAY KODU</h3>
          <p>${randomCode} kodu girerek E-posta hesabınızı onaylayın</p>
    `
        await sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "E-POSTA ONAYI",
            html: checkEmailTemplate
        });

        res.redirect("/auth/check_email");
    }catch (err){
        console.log(err);
        return  res.status(500).render("pages/error/500");
    }
}

const checkEmail=async (req,res,next)=>{

    try{
        const user=await  UserModel.findOne({checkEmailCode:req.body.checkEmailCode,checkEmailCodeExpire:{$gt:Date.now()}});
        if(!user){
            return res.status(400).render("pages/checkEmail",{
                checkEmailError:"Kodun süresi dolmuş veya geçersiz."
            });
        }
        user.checkEmail=true;
        user.checkEmailCode=undefined;
        user.checkEmailCodeExpire=undefined;
        await user.save();
        req.flash("registerSuccess",`kayıt olundu, ${user.email} E-posta adresini kullanarak giriş yapabilirsin.`);
        return  res.status(200).redirect("/auth/login");

    }catch (err){
        return res.stat(500).render("pages/error/500");
    }
}

const checkEmailSendCodePage= (req,res)=>{
    return res.status(400).render("pages/checkEmailSendCode");

}

const checkEmailPage=(req,res,next)=>{
    return res.status(200).render("pages/checkEmail");
}

*/


module.exports = {
    loginPage,
    registerPage,
    forgotPasswordPage,
    resetPasswordPage,
    forgotPassword,
    resetPassword,
    register,
    login,
    logout,

}
