const bcrypt = require('bcryptjs');

const validateUserInputs = (email, password) => {
    return email && password;
};

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}
module.exports = {
    validateUserInputs,
    comparePassword
};