const { createVerify } = require('crypto');
const multer = require('multer');
const path = require('path');
const CustomError = require('../../helpers/errors/CustomError');


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const rootDirectory = path.dirname(require.main.filename);
        callback(null, path.join(rootDirectory, "/public/uploads/recipe_images"));
    },
    filename: function (req, file, callback) {
        // File - Mimetype => image/png
        const { id } = req.params;
        
        const extension = file.mimetype.split("/")[1];
        req.savedRecipeImage = "image_" + id + "." + extension;
        callback(null, req.savedRecipeImage);
    }
});

const fileFilter = (req, file, callback) => {
    let allowedMimeTypes = ["image/png", "image/jpg", "image/gif", "image/jpeg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new CustomError("Please provide a valid image file", 400), false);
    }

    return callback(null, true);

};


const recipeImageUpload = multer({ storage, fileFilter });

module.exports = recipeImageUpload;
