const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const RecipeSchema = new Schema({
    recipe_image: {
        type: String,
        default: "default.jpg"
    },
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
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    slug: String,
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
});

RecipeSchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        next();
    }
    
    this.slug = this.makeSlug();
    next();
});

RecipeSchema.methods.makeSlug = function () {
    return slugify(this.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@/]/g, // remove characters that match regex, defaults to `undefined`
        lower: true      // convert to lower case, defaults to `false`
    });
};

module.exports = mongoose.model("Recipe", RecipeSchema);