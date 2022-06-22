/**
 * @file routers about articles
 * @author Ting Wang
 */
const express = require('express');
const router = express.Router();
const usersDao = require('../modules/users-dao.js');
const articleDao = require('../modules/article-dao.js');
const articleCommentDao = require('../modules/articleComment-dao.js');
const {notifyHandler} = require('../utils/index');
// Setup multer (files will temporarily be saved in the "temp" folder).
// const path = require("path");
const multer = require("multer");
const upload = multer({
    dest: './temp'
});

// Setup fs
const fs = require("fs");

// Setup jimp
const jimp = require("jimp");

/**
 * render the new article page
 */
router.get('/newarticle', async function (req, res) {
    res.locals.title = `New Article`;
    res.render("newarticle");
});

function commentsHandler(data, username, myarticle) {
    for (let i = 0; i < data.length; i++) {
        let cur = data[i];
        cur.myarticle = myarticle;
        if (cur.CommentedByID == username) {
            cur.mycomment = 1;
        }
        if (cur.children) {
            return commentsHandler(cur.children, username, myarticle);
        }
    }
    return data;
}
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
            const myarticle = article.ArticleCreator == username;
            res.locals.myarticle = myarticle;
            commentsHandler(commentsInOrder, username, myarticle);
            console.log(JSON.stringify(commentsInOrder))
        }
        res.locals.commentsToShow = commentsInOrder;        
        res.locals.articleID = articleID;
        res.locals.content = article.ArticleContent;
        res.locals.authorAvator = article.AvatarPath;
        res.locals.author = article.ArticleCreator;
        res.locals.date = article.CreatedDateTime;
        res.locals.coverImagePath = article.ArticleImagePath;

        // this also change the title of the page in <head> 
        res.locals.title = article.ArticleTitle;

        res.render("viewarticle");
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
        if (username == author) {
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
router.post('/newarticle', upload.single("coverImage"), async function (req, res) {
    try {
        const username = req.session.username;
        // get the info from the form
        let { title, content } = req.body;
        const fileInfo = req.file;
        var filePath = `images/coverImages/defaultCover.jpg`;

        if (fileInfo != undefined) {
            // get the extension of the image
            const originalName = fileInfo.originalname;
            const extension = originalName.toLowerCase().substring(originalName.lastIndexOf("."));

            // Move the dafult file location to a new file location inside the folder "./public/images/" with indexed image name, for example "image_0.jpg".
            const oldFileName = fileInfo.path;
            const numberOfImages = fs.readdirSync("public/images/thumbnails").length;
            const newFileName = `./public/images/coverImages/image_${numberOfImages}${extension}`;

            // Use the temp directory location & name to write the permanent location & name
            fs.renameSync(oldFileName, newFileName);

            // Using jimp, read in the image, resize it
            const image = await jimp.read(newFileName);
            image.resize(320, jimp.AUTO);

            // save the image to the thumbnail folder with the correct name.
            await image.write(`./public/images/thumbnails/image_${numberOfImages}${extension}`)

            // asign new file path
            filePath = `images/coverImages/image_${numberOfImages}${extension}`;
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
            var filePath;
            if (deleteImg) {
                filePath = `images/coverImages/defaultCover.jpg`;
            } else {
                filePath = article.ArticleImagePath;
            }
            const oldFileName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
            
            // get the info from the form
            let { title, content } = req.body;
            const newFileInfo = req.file;

            if (newFileInfo) {
                // get the extension of the image
                const newFileOriginalName = newFileInfo.originalname;
                const extension = newFileOriginalName.toLowerCase().substring(newFileOriginalName.lastIndexOf("."));

                // Move the dafult file location to a new file location inside the folder "./public/images/" with indexed image name, for example "image_0.jpg".
                const tempFilePath = newFileInfo.path;
                var newFilePath;
                const numberOfImages = fs.readdirSync("public/images/thumbnails").length;

                if (oldFileName == 'defaultCover') {
                    newFilePath = `./public/images/coverImages/image_${numberOfImages}${extension}`;

                    // Use the temp directory location & name to write the permanent location & name
                    fs.renameSync(tempFilePath, newFilePath);

                    // Using jimp, read in the image, resize it
                    const image = await jimp.read(newFilePath);
                    image.resize(320, jimp.AUTO);

                    // save the image to the thumbnail folder with the correct name.
                    await image.write(`./public/images/thumbnails/image_${numberOfImages}${extension}`)

                    // asign new file path
                    filePath = `images/coverImages/image_${numberOfImages}${extension}`;
                } else {
                    newFilePath = `./public/images/coverImages/${oldFileName}${extension}`;
                    // Use the temp directory location & name to write the permanent location & name
                    fs.renameSync(tempFilePath, newFilePath);

                    // Using jimp, read in the image, resize it
                    const image = await jimp.read(newFilePath);
                    image.resize(320, jimp.AUTO);

                    // save the image to the thumbnail folder with the correct name.
                    await image.write(`./public/images/thumbnails/${oldFileName}${extension}`);

                    // asign new file path
                    filePath = `images/coverImages/${oldFileName}${extension}`;
                }
            }

            // update the article and render to view this article
            const updateArticle = await articleDao.updateArticleByID(articleID, title, content, filePath);
            res.redirect(`/viewarticle?articleID=${articleID}`);

        } catch (error) {
            res.redirect(`/viewarticle?articleID=${articleID}`);
        }

    } catch (error) {
        res.redirect('/');
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



router.post('/newcomment', async function (req, res) {
    try {
        const articleID = req.query.articleID;
        const username = req.session.username;
        const { commentContent } = req.body;
        const commentInfo = await articleCommentDao.insertComment(articleID, username, commentContent, null);
    
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
        const articleID = req.query.articleID;
        const replyToID = req.query.replyToID;
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
        const articleID = req.query.articleID;
        const commentID = req.query.commentID;
        const { commentContent } = req.body;
        await articleCommentDao.updateCommentByCommentID(commentID, commentContent);
        res.redirect(`/viewarticle?articleID=${articleID}`);
    } catch (error) {
        res.redirect(`/viewarticle?articleID=${articleID}`);
    }
});

module.exports = router;