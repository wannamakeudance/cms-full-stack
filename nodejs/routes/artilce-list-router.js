/**
 * @file show the list of articles, also handle the filter of ariticles
 * @author xiangzheng Jing
 */

const express = require('express');
const router = express.Router();
const users_INNER_JOIN_avatar = require('../modules/users-INNER JOIN-avatar-dao.js');
const articleDao = require('../modules/article-dao.js');
const articleLikeDao = require('../modules/articleLike-dao.js');
const {likeStatusHandler} = require('../utils/index');
const { convert } = require('html-to-text');

router.get('/', async function(req, res) {

    res.locals.title = "Nature Protection";

    // set avatar into session
    const username = req.session.username;
    const avatarDetail = await users_INNER_JOIN_avatar.getAvatarPathByUserName(username);
    if (avatarDetail) {
        res.locals.avatar = avatarDetail.AvatarPath;
        req.session.avatar = avatarDetail.AvatarPath;
    }

    // get the list of the articles
    let list = await articleDao.getAllArticlesByNewest();
    const listLikedByUser = await articleLikeDao.getArticlesLikedByUser(username);
    const listWithLikeStatus = likeStatusHandler(list, listLikedByUser);

    listWithLikeStatus.forEach(e => {
        let plaintext = convert(e.ArticleContent, {
            wordwrap: 130
        });

        if (plaintext.length > 230) {
            plaintext = plaintext.substring(0, 230);
            if (plaintext.charAt(plaintext.length - 1) != ' ') {
                plaintext = plaintext.substring(0, plaintext.lastIndexOf(' '));
            }
        }
        e.ArticleContent = plaintext + `...`;
    });

    res.locals.articleList = listWithLikeStatus;
    res.locals.showUserName = true;
    res.locals.isCurrentUser = true;
    res.render('home');
});


/**
 * sort the articles by date /title /username. 
 */
router.get('/filter',async function(req, res) {
    const {type, isMyArticles, userName} = req.query;
    const username = userName || res.locals.username;
    let list = [];
    switch(type) {
        case 'sort-new': 
            list = isMyArticles ? await articleDao.getAllArticlesByNewestByUserName(username)
                : await articleDao.getAllArticlesByNewest();
        break;

        case 'sort-old':
            list = isMyArticles ? await articleDao.getAllArticlesByOldestByUserName(username)
                : await articleDao.getAllArticlesByOldest();
        break;

        case 'sort-title':
            list = isMyArticles ? await articleDao.getAllArticlesByArticleTitleAscByUserName(username)
                : await articleDao.getAllArticlesByArticleTitleAsc();
        break;

        case 'sort-username':
            list = await articleDao.getAllArticlesByUserNameAsc();
        break;

        default:
            list = isMyArticles ? await articleDao.getAllArticlesByNewestByUserName(username)
            : await articleDao.getAllArticlesByNewest();
        }
    const listLikedByUser = await articleLikeDao.getArticlesLikedByUser(req.session.username);
    const listWithLikeStatus = likeStatusHandler(list, listLikedByUser);

    listWithLikeStatus.forEach(e => {
        let plaintext = convert(e.ArticleContent, {
            wordwrap: 130
        });

        if (plaintext.length > 230) {
            plaintext = plaintext.substring(0, 230);
            if (plaintext.charAt(plaintext.length - 1) != ' ') {
                plaintext = plaintext.substring(0, plaintext.lastIndexOf(' '));
            }
        }
        e.ArticleContent = plaintext + `...`;
    });
    
    res.json({
        data: listWithLikeStatus
    })
});

/**
 * the specify article is liked by some user
 */
router.post('/like', async function(req, res) {
    try {
        let {articleID, username} = req.body;
        articleID = Number(articleID);
        await articleLikeDao.insertLike(articleID, username);
        res.json({
            errno: 0,
            message: 'success!'
        })
    } catch (error) {
        res.json({
            errno: 500,
            message: 'error:' + JSON.stringify(error)
        });
    }
});

/**
 * the specify article is unliked by some user
 */
 router.post('/unlike', async function(req, res) {
    try {
        let {articleID, username} = req.body;
        articleID = Number(articleID);
        await articleLikeDao.deleteLike(articleID, username);
        res.json({
            errno: 0,
            message: 'success!'
        })
    } catch (error) {
        res.json({
            errno: 500,
            message: 'error:' + JSON.stringify(error)
        });
    }
});
module.exports = router;