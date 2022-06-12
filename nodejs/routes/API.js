const express = require('express');
const router = express.Router();
const usersDao = require('../modules/users-dao.js');
const articleDao = require('../modules/article-dao.js');
const userPasswordDao = require("../modules/userPassword-dao.js");
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

router.post('/api/login', async function (req, res) {
    try {
        console.log(req.body)
        const { password, username } = req.body;
        const passwordDetail = await userPasswordDao.getPasswordByUsername(username);
        const passwordHash = passwordDetail.Password;
        const compareResult = bcrypt.compareSync(password, passwordHash);
        if (compareResult) {

            const authToken = uuid();
            req.session.username = username;
            res.cookie('authToken', authToken);
            await userPasswordDao.updateAuthTokenByUsername(username, authToken);
            res.sendStatus(204);

        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/api/logout', async function (req, res) {
    try {
        res.clearCookie("authToken");
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.get('/api/users', async function (req, res) {
    try {
        const userDetail = await usersDao.getUserDetailsByUserName(req.session.username);
        const userrole = userDetail.UserRoleID;

        if (userrole == "1") {
            const alluser = await usersDao.getAllUserAccountsDetails();
            for (let i = 0; i < alluser.length; i++) {
                const e = alluser[i];
                let articlesList = await articleDao.getAllArticlesByArticleTitleDesByUserName(e.UserName);
                e[`ArticlesCreated`] = articlesList.length;
            }

            res.status(200).send(alluser);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.delete('/api/users/:id', async function (req, res) {
    try {
        const userID = req.params.id;
    
        const userDetail = await usersDao.getUserDetailsByUserName(req.session.username);
        const userrole = userDetail.UserRoleID;

        if (userrole == "1") {
            const deleteUserResult = await usersDao.deleteUser(userID);
            if (deleteUserResult.changes == 0) {
                res.sendStatus(400);
                return;
            }
            res.sendStatus(204);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(400);
    }
});
module.exports = router;