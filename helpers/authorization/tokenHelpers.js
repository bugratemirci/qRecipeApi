const sendJwtClient = (user, res) => {

    const token = user.generateJwtFromUser();
    const {JWT_COOKIE, NODE_ENV} = process.env; 
    return res.status(200).cookie("access_token", token, { 
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
        httpOnly: true,
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        access_token: token,
        data: {
            name: user.name,
            email: user.email, 
            id: user.id
        }
    });
};

const isTokenInclueded = (req) => {
    
    return (req.headers.authorization && req.headers.authorization.startsWith("Bearer:")) || req.body.access_token.startsWith("Bearer:");

}

const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    
    const access_token = req.body.access_token.split(" ")[1];
    console.log(access_token);
    return access_token;
}

module.exports = {
    sendJwtClient,
    isTokenInclueded,
    getAccessTokenFromHeader
};