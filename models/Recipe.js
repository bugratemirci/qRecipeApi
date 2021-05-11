const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

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
    }],
    recipe_image: {
        type: String,
        default: "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"
    }
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