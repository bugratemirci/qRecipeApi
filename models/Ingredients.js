const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const IngredientSchema = new Schema({
    ingredients_name: {
        type: String,
        required: [true, "Please provide a ingredients name."]
    }
});

module.exports = mongoose.model("Ingredient", IngredientSchema);