const CategoryModel = require('../models/category')

const categoriesPage = (req, res) => {
    res.render('pages/adminCategory', {
        layout: 'adminLayout',
    })
}

const categories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find()

        res.status(200).json({
            success: true,
            data: { categories },
            message: 'Tüm kategoriler listelendi',
        })
    } catch (err) {
        return next(err)
    }

}

const addCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.create({ ...req.body })
        res.status(200).json({
            success: true,
            data: { category },
            message: `${category.category} adlı kategori başarılı bir şekilde eklendi`,

        })
    } catch (err) {
        return next(err)
    }

}

const deleteCategory = async (req, res, next) => {
    try {
        await CategoryModel.deleteOne({ _id: req.params.categoryId })
        res.status(200).json({
            success: true,
            message: 'kategori başarıyla  silindi',
        })
    } catch (err) {
        return next(err)
    }

}

const editCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findByIdAndUpdate(req.params.categoryId, { ...req.body }, {
            runValidators: true,
            new: true,
        })

        res.status(200).json({
            success: true,
            data: { category },
            message: 'Kategori güncellendi.',
        })
    } catch (err) {
        return next(err)
    }

}

module.exports = { categories, categoriesPage, addCategory, deleteCategory, editCategory }
