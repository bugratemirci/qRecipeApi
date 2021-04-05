const CustomError = require("../../helpers/errors/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenInclueded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");


const getAccessToRoute = (req, res, next) => {
    
    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenInclueded(req)){
        return next(new CustomError("You are not authorized to access this route", 401));
    }
    const access_token = getAccessTokenFromHeader(req);
    jwt.verify(access_token, JWT_SECRET_KEY, (err,decoded) => {
        if(err) {
            return next(new CustomError("You are not authorized to access this route", 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        
        next();
    });
}

module.exports = {
    getAccessToRoute
};