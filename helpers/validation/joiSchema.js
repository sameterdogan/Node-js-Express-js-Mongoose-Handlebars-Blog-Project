const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


const registerSchema = Joi.object().keys({
    name: Joi.string().$.min(5).max(25).trim().rule({ message: 'İsim ve soyisim alanı en az 5 en fazla 25 karakter olmalıdır.' }),
    email: Joi.string().$.email({ tlds: { allow: false } }).rule({ message: 'E-posta adresi geçersiz.' }),
    password: Joi.string().$.min(8).max(20).trim().rule({ message: 'Şifre alanı en az 8 en fazla 20 karakter olmalıdır.' }),
})

const emailSchema = Joi.object().keys({
    email: Joi.string().$.email({ tlds: { allow: false } }).rule({ message: 'E-posta adresi geçersiz.' }),
})
const passwordSchema = Joi.object().keys({
    password: Joi.string().$.min(8).max(20).trim().rule({ message: 'Şifre alanı en az 8 en fazla 20 karakter olmalıdır.' }),
})

const blogSchema = Joi.object().keys({
    blogTitle: Joi.string().$.min(5).trim().rule({ message: 'Başlık alanı en az 5 karakterden oluşmalı.' }),
    blogSummary: Joi.string().$.min(20).trim().rule({ message: 'Özet alanı en az 20 karakterden oluşmalı.' }),
    blogContent: Joi.string().$.min(100).trim().rule({ message: 'İçerik alanı en az 100 karakterden oluşmalı.' }),
    category: Joi.objectId(),
})


const userSchema = Joi.object().keys({
    name: Joi.string().$.min(5).max(25).trim().rule({ message: 'İsim ve soyisim alanı en az 5 en fazla 25 karakter olmalıdır.' }),
    company: Joi.string().$.allow('').max(50).trim().rule({ message: 'İş yeri  alanı en fazla 50 karakterden oluşmalı.' }),
    instagram: Joi.string().$.allow('').uri().trim().rule({ message: 'İnstagram alanı bir url olmalı.' }),
    linkedIn: Joi.string().$.allow('').uri().trim().rule({ message: 'linkedIn alanı bir url olmalı.' }),
    webSite: Joi.string().$.allow('').uri().trim().rule({ message: 'webSite alanı bir url olmalı.' }),
})

const categorySchema = Joi.object().keys({
    category: Joi.string().$.min(2).max(50).trim().rule({ message: 'Kategori alanı en az 2 en fazla 50 karakter olmalıdır.' }),
})


module.exports = { registerSchema, emailSchema, passwordSchema, blogSchema, userSchema, categorySchema }

