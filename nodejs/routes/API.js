const express = require('express');
const router = express.Router();
const usersDao = require('../modules/users-dao.js');
const articleDao = require('../modules/article-dao.js');
const usersJoinAvatarDao = require('../modules/users-INNER JOIN-avatar-dao');
const userPasswordDao = require("../modules/userPassword-dao.js");
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

router.post('/api/login', async function (req, res) {
    try {
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
        res.status(500).json({
            errorMsg: JSON.stringify(error)
        });
    }
});

router.get('/api/logout', async function (req, res) {
    try {
        req.session.destroy();
        res.clearCookie("authToken");
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            errorMsg: JSON.stringify(error)
        });
    }
});

router.get('/api/users', async function (req, res) {
    try {
        const userDetail = await usersDao.getUserDetailsByUserName(req.session.username);
        const userRole = userDetail.UserRoleID;

        if (userRole === 1) {
            const allUsers = await usersDao.getAllUserAccountsDetails();
            for (let i = 0; i < allUsers.length; i++) {
                const UserName = allUsers[i].UserName;
                const {AvatarPath} = await usersJoinAvatarDao.getAvatarPathByUserName(UserName)
                const {TOTAL} = await articleDao.getCountOfArticlesCreatedByUserName(UserName);
                allUsers[i].AvatarPath = AvatarPath;
                allUsers[i].ArticlesCreated = TOTAL;
            }
            res.status(200).json(allUsers);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.status(500).json({
            errorMsg: JSON.stringify(error)
        });
    }
});

router.delete('/api/users/:id', async function (req, res) {
    try {
        const userID = req.params.id;
        const userDetail = await usersDao.getUserDetailsByUserName(req.session.username);
        const userRole = userDetail.UserRoleID;

        if (userRole === 1) {
            const deleteUserResult = await usersDao.deleteUser(userID);
            if (deleteUserResult.changes == 0) {
                return res.status(500).json({
                    errorMsg: "Delete failed due to the changes equal to 0"
                });
            }
            res.sendStatus(204);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.status(500).json({
            errorMsg: JSON.stringify(error)
        });    
    }
});
module.exports = router;