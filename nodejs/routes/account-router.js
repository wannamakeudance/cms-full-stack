/**
 * @file routers about account
 * @author xiangzheng Jing
 */
const express = require('express');
const router = express.Router();
const usersDao = require('../modules/users-dao.js');
const avatarDao = require('../modules/avatar-dao.js');
const userPasswordDao = require("../modules/userPassword-dao.js");
const bcrypt = require('bcrypt');
const {v4: uuid} = require('uuid');
const saltRounds = 10;

/**
 * render the login page
 */
router.get('/login', async function(req, res) {
    res.locals.title = 'login';
    res.render('login');
});

/**
 * render the password edit
 */
router.get('/passwordedit', async function(req, res) {
    res.locals.title = 'edit password';
    res.render('passwordedit');
});

/**
 * render the sign up page
 */
router.get('/signup', async function(req, res) {
    const allAvatarDetails = await avatarDao.getAllAvatarDetails();
    res.locals.avatarlist = JSON.parse(JSON.stringify(allAvatarDetails));
    res.locals.title = 'signup';
    res.render('signup');
});

/**
 * judge the login anction
 */
router.post('/login', async function(req, res) {
    try {
        const {password, username} = req.body;
        const passwordDetail = await userPasswordDao.getPasswordByUsername(username);
        const passwordHash = passwordDetail.Password;
        const compareResult = bcrypt.compareSync(password, passwordHash);
        if (compareResult) {
            
            const authToken = uuid();
            req.session.username = username;
            res.cookie('authToken', authToken);
            await userPasswordDao.updateAuthTokenByUsername(username, authToken);
            res.status(204).redirect('/');
        } else {
            res.setToastMessage('Please check your password and username.');
            res.status(401).redirect('/login');
        }
    } catch (error) {
        res.setToastMessage('Login failed! ' + JSON.stringify(error)); 
        res.redirect('/login');
    }
});

/**
 * insert a new account & password into dabase
 */
 router.post('/signup', async function(req, res) {
    try {
        let {
            username,
            firstname,
            lastname,
            password,
            birthday,
            introduce, 
            avatar = 5
        } = req.body;
        
        avatar = Number(avatar);
        // add hash & salt to password
        const hashPassword = bcrypt.hashSync(password[0], saltRounds);
        res.locals.createUserAccount = await usersDao.createUserAccount(username, firstname, lastname, birthday, introduce, 2, avatar);
        await userPasswordDao.insertUserPassword(username, ("" + saltRounds), hashPassword);
        
        // if success, redirect to login page
        res.redirect('/login');

    } catch (error) {
        res.setToastMessage(JSON.stringify(error));
        res.redirect('/signup');
    }
});

/**
 * render the edit account page
 */
router.get('/accountedit', async function(req, res) {
    try {
        const username = req.session.username;
        const userDetails = await usersDao.getUserDetailsByUserName(username);
        const passwordDetail = await userPasswordDao.getPasswordByUsername(username);
        const allAvatarDetails = await avatarDao.getAllAvatarDetails();
        res.locals.password = passwordDetail.Password;
        res.locals.userDetails = userDetails;
        res.locals.avatarlist = JSON.parse(JSON.stringify(allAvatarDetails));
        res.locals.title = 'edit account';
        res.render('accountedit');
    } catch (error) {
        res.setToastMessage(JSON.stringify(error));
        res.redirect('/');
    }
});

/**
 * update an account information includes password
 */
router.post('/accountedit', async function(req, res) {
    try {
        let {
            username,
            firstname,
            lastname,
            birthday,
            introduce, 
            avatar = 5,
            UserRoleID
        } = req.body;
        avatar = Number(avatar);
        UserRoleID = Number(UserRoleID);
        res.locals.createUserAccount = await usersDao.updateUserAccount(username, firstname, lastname, birthday, introduce, UserRoleID, avatar);
        res.redirect('/');
    } catch (error) {
        res.setToastMessage(JSON.stringify(error));
        res.redirect('/accountedit');
    }
});

/**
 * account logout
 */
router.get('/logout', function(req, res) {
    req.session.username = null;
    req.session.avatar = null;
    res.status(204).redirect('/login');
});

/**
 * destroy user account
 */
router.post('/accountdelete', async function(req, res) {
    try {
        await usersDao.deleteUser(req.session.username);
        res.json({
            errno: 0,
            message: 'success!'
        });
    } catch (error) {
        console.log(error)
        res.json({
            errno: 500,
            message: 'error:' + JSON.stringify(error)
        });
    }
});

/**
 * modify the password of account
 */
router.post('/passwordedit', async function(req, res) {
    try {
        const password = req.body.password;
        const hashPassword = bcrypt.hashSync(password, saltRounds);
        await userPasswordDao.updateUserPassword(req.session.username, (saltRounds + ""), hashPassword);
        res.redirect('/');
    } catch (error) {
        res.setToastMessage('error:' + JSON.stringify(error));
        res.redirect('/passwordedit');
    }
});

/**
 * check if the username is unique in databse
 */
router.get('/checkusername', async function(req, res) {
    try {
        const username = req.query.username;
        const userDetail = await usersDao.getUserDetailsByUserName(username);
        if (userDetail) {
            res.json({
                errno: 401,
                message: 'Username has existed, please try another one.'
            });
        } else {
            res.json({
                errno: 0,
                message: 'success!'
            });
        }
    } catch (error) {
        res.json({
            errno: 500,
            message: 'error:' + JSON.stringify(error)
        });
    }
});

module.exports = router;