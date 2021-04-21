const mongoose = require('mongoose')
const BlogModel = require('./blog')

const Schema = mongoose.Schema

const CategorySchema = new Schema({

    category: {
        type: String,
    },
})


CategorySchema.path("category").validate(async (category)=>{
    const  categoryCount= await mongoose.models.Category.countDocuments({category});
    return !categoryCount;
},"Bu kategori zaten mevcut.");


CategorySchema.pre('deleteOne', async function(next) {
    try {
        const categoryId = this.getFilter()['_id']
        await BlogModel.deleteMany({ category: categoryId })
    } catch (err) {
        return next(err)
    }

})


const Category = mongoose.model('Category', CategorySchema)
module.exports = Category


