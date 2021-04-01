const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RecipeSchema = new Schema({
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"]
        },
        ingredients: [{
            type: String,
        }],
        rating: {
            type: Number,
        },
        comments: [{
            type: String,
        }]
});

module.exports = mongoose.model("Recipe", RecipeSchema);