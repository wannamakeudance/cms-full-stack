/**
 * @file auth middleware.js
 * @author xiangzheng Jing
 */
const userPasswordDao = require('../modules/userPassword-dao.js');
const {
    whitePathList,
    whitePartPathReg,
    whiteJsonPathList
} = require('./path-config');

async function validateAuthToken(req, res, next) {
    try {
        const {username, avatar} = req.session;
        const token = await userPasswordDao.getAuthTokenByUsername(username);
        if (token && token.AuthToken === req.cookies.authToken) {
            res.locals.isLogin = true;
            res.locals.username = username;
            res.locals.avatar = avatar;
            next();
        }
        else {
            if (whitePartPathReg.test(req.path) || whitePathList.indexOf(req.path) !== -1) {
                next();
                return;
            }
            
            res.locals.isLogin = false;
            if (whiteJsonPathList.indexOf(req.path) !== -1) {
                res.json({
                    errno: 304,
                    message: 'need to login!'
                });
            } else {
                res.redirect('/login'); 
            }
        }
        
    } catch (error) {
        res.locals.isLogin = false;
        console.log(error);
    }
}
module.exports = validateAuthToken;