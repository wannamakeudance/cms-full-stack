
const express = require('express');
const router = express.Router();
const articleDao = require('../modules/article-dao.js');
const articleCommentDao = require('../modules/articleComment-dao.js');
const {notifyHandler} = require('../utils/index');

router.post('/newcomment', async function (req, res) {
    try {
        const articleID = req.query.articleID;
        const username = req.session.username;
        const { commentContent } = req.body;
        await articleCommentDao.insertComment(articleID, username, commentContent, null);
        // insert a notification into the database
        await notifyHandler({
            notifcationType: 2,
            username,
            articleID
        });
        
        res.redirect(`/viewarticle?articleID=${articleID}`);
    } catch (error) {
        res.redirect(`/viewarticle?articleID=${articleID}`);
    }
});

router.post('/newreply', async function (req, res) {
    try {
        const {articleID, replyToID} = req.query;
        const username = req.session.username;
        const { replyContent } = req.body;
        await articleCommentDao.insertComment(articleID, username, replyContent, replyToID);
        
        // insert a notification into the database
        await notifyHandler({
            notifcationType: 2,
            username,
            articleID
        });
    
        res.redirect(`/viewarticle?articleID=${articleID}`);
    } catch (error) {
        res.redirect(`/viewarticle?articleID=${articleID}`);
    }
});

router.post('/updateComment', async function (req, res) {
    try {
        const {articleID, commentID} = req.query;
        const { commentContent } = req.body;
        await articleCommentDao.updateCommentByCommentID(commentID, commentContent);
        res.redirect(`/viewarticle?articleID=${articleID}`);
    } catch (error) {
        res.redirect(`/viewarticle?articleID=${articleID}`);
    }
});

/**
 * form post action of deletearticle
 */
 router.post('/deletearticle', async function (req, res) {
    try {
        const articleID = req.query.articleID;
        await articleDao.deleteArticleByID(articleID);
        res.redirect('/');
    } catch (error) {
        res.redirect('/');
    }
});

router.post('/deleteComment', async function (req, res) {
    try {
        const articleID = req.query.articleID;
        const commentID = req.query.commentID;
        await articleCommentDao.deleteCommentByCommentID(commentID);
        res.redirect(`/viewarticle?articleID=${articleID}`);
    } catch (error) {
        res.redirect(`/viewarticle?articleID=${articleID}`);
    }
});

module.exports = router;