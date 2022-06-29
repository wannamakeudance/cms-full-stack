/**
 * @file routers about articles
 * @author Ting Wang
 */
const express = require('express');
const router = express.Router();
const articleDao = require('../modules/article-dao.js');
const articleCommentDao = require('../modules/articleComment-dao.js');
const {notifyHandler, resizeImage, commentsHandler} = require('../utils/index');
const multer = require("multer");
const jimp = require('jimp');
const upload = multer({
    dest: './temp'
});

/**
 * render the new article page
 */
router.get('/newarticle', async function (req, res) {
    res.locals.title = `New Article`;
    res.render('newarticle');
});

/**
 * render the view article page
 */
router.get('/viewarticle', async function (req, res) {
    try {
        // get the current user
        const username = req.session.username;
        if (username) {
            res.locals.username = username;
        }

        // get article By articleID
        const articleID = req.query.articleID;
        const article = await articleCommentDao.getArticleByArticleID(articleID);
        const myarticle = article.ArticleCreator == username;

        // get comments by articleID
        const comment = await articleCommentDao.getArticleCommentsByArticleID(articleID);
        if (comment) {
            // reverse the array so the latest commentID the first
            var commentsInOrder = [];
            var length = comment.children.length;
            for (var i = length - 1; i >= 0; i--) {
                commentsInOrder.push(comment.children[i]);
            }
            // show edit/delete option if it's created by current user
            commentsHandler(commentsInOrder, username, myarticle);
        }

        res.locals.commentsToShow = commentsInOrder;        
        res.locals.articleID = articleID;
        res.locals.content = article.ArticleContent;
        res.locals.authorAvator = article.AvatarPath;
        res.locals.author = article.ArticleCreator;
        res.locals.date = article.CreatedDateTime;
        res.locals.coverImagePath = article.ArticleImagePath;
        res.locals.myarticle = myarticle;
        res.locals.title = article.ArticleTitle;

        res.render('viewarticle');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

/**
 * render the edit article page
 */
router.get('/editarticle', async function (req, res) {
    try {
        // get the current user
        const username = req.session.username;

        // get article By articleID
        const articleID = req.query.articleID;
        const article = await articleCommentDao.getArticleByArticleID(articleID);

        // show edit content if it's created by current user
        const author = article.ArticleCreator;
        if (username === author) {
            // this also change the title of the page in <head> 
            res.locals.title = `Edit Article`;
            res.locals.articleID = articleID;
            res.locals.articleTitle = article.ArticleTitle;
            res.locals.content = article.ArticleContent;
            res.locals.authorAvator = article.AvatarPath;
            res.locals.author = author;
            res.locals.coverImagePath = article.ArticleImagePath;
            if (article.ArticleImagePath != 'images/coverImages/defaultCover.jpg') {
                res.locals.notDefaultCover = `1`;
            }
            res.render("editarticle");
        } else {
            res.redirect('/');
        }

    } catch (error) {
        res.redirect('/');
    }
});

/**
 * form post action of newarticle
 */
router.post('/newarticle', upload.single('coverImage'), async function (req, res) {
    try {
        const username = req.session.username;
        let { title, content } = req.body;

        const fileInfo = req.file;
        let filePath = `images/coverImages/defaultCover.jpg`;

        if (fileInfo) {
            filePath = await resizeImage(fileInfo, jimp);
        }
       
        // insert the article and render to view this article
        const insertArticle = await articleDao.insertArticle(title, username, content, filePath);
        
        // insert a notification into the database
        await notifyHandler({
            notifcationType: 1,
            username,
            articleID: insertArticle.lastID
        });

        res.redirect(`/viewarticle?articleID=${insertArticle.lastID}`);

    } catch (error) {
        res.redirect('/newarticle');
    }


});

/**
 * form post action of editarticle
 */
router.post('/editarticle', upload.single("coverImage"), async function (req, res) {
    try {
        // get article By articleID
        const articleID = req.query.articleID;
        const deleteImg = req.query.deleteImg;

        try {
            const article = await articleCommentDao.getArticleByArticleID(articleID);
            let filePath = deleteImg ? `images/coverImages/defaultCover.jpg` : article.ArticleImagePath;         
            let { title, content } = req.body;
            const newFileInfo = req.file;
            if (newFileInfo) {
                filePath = await resizeImage(newFileInfo, jimp);
            }

            // update the article and render to view this article
            await articleDao.updateArticleByID(articleID, title, content, filePath);
            res.redirect(`/viewarticle?articleID=${articleID}`);

        } catch (error) {
            res.redirect(`/viewarticle?articleID=${articleID}`);
        }

    } catch (error) {
        res.redirect('/');
    }
});
module.exports = router;