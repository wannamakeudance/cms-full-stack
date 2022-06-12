/**
 * @file define the consts of path
 * @author xiangzheng Jing
 */

const whitePathList = ['/signup','/viewarticle', '/login', '/', '/checkusername', '/filter', '/api/login', '/api/logout', '/api/users'];
const whitePartPathReg = /\/api\/users\//;
const whiteJsonPathList = ['/like', '/unlike'];

module.exports = {
    whitePathList,
    whitePartPathReg,
    whiteJsonPathList
};