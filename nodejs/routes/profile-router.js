/**
 * 
 * @author Taiqi Liu & Shakeel Ali
 */

const express = require('express');
const router = express.Router();
const usersDao = require('../modules/users-dao.js');
const articleLikeDao = require('../modules/articleLike-dao.js');
const followingDao = require('../modules/following-dao.js');
const followersDao = require('../modules/followers-dao.js');
const analyticsDao = require('../modules/analytics-dao.js');
const subscribeDao = require('../modules/userSubscription-dao.js');
const avatarDao = require('../modules/avatar-dao.js');
const articleDao = require('../modules/article-dao.js');
const {likeStatusHandler, notifyHandler} = require('../utils/index');
const { convert } = require('html-to-text');

router.get('/accountcenter', async function (req, res) {
    const username = req.query.username;
    const userDetail = await usersDao.getUserDetailsByUserName(username);
    const avatar = await avatarDao.getAvatarPath(userDetail.AvatarID);
    res.locals.profileavatar = avatar.AvatarPath;
    res.locals.profileusername = userDetail.UserName;
    res.locals.introduction = userDetail.AboutMeDescription;
    res.locals.birthday = userDetail.DateOfBirth;
    res.locals.title = "Accountcenter";
    const iffollowing = await followingDao.checkIfUserIsSubscribedToAnother(req.session.username, username);

    if (req.query.status == "following" && iffollowing == undefined) {
        await subscribeDao.insertSubscriber(req.session.username, username);
        
        // insert a notification into the database
        await notifyHandler({
            notifcationType: 3,
            subscriberName: username,
            username: req.session.username
        });

    } else if (req.query.status == 'unfollow' && iffollowing != undefined) {
        await subscribeDao.removeSubscription(req.session.username, username);
    }


    //getting total users this.user has subscribed to. [Basically: Following]  (STATUS == WORKS!!)
    const totalUsersSubscribedTo = await followingDao.getTotalSubscribedToByUsername(username);
    res.locals.totalUsersSubscribedTo = totalUsersSubscribedTo.TotalSubscribedTo;

    //getting total subscribers this.user has [Basically: Followers]  (STATUS == WORKS!!)
    const totalSubscribers = await followersDao.getTotalSubscribersByUsername(username);
    res.locals.totalSubscribers = totalSubscribers.TotalSubscribers;
    if (req.session.username != username) {
        if (iffollowing != undefined) {
            res.locals.followingstatus = "(Following)";
        } else if (iffollowing == undefined) {
            res.locals.followingstatus = "(Not following)";
        }
    }
    res.locals.isCurrentUser = req.session.username === username;

    // get the articles created by the current user
    const list = await articleDao.getAllArticlesByArticleTitleDesByUserName(username);
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

    res.render("accountcenter");
});







router.get('/analytics', async function (req, res) {
    const username = req.query.username;
    const userDetail = await usersDao.getUserDetailsByUserName(username);
    const avatar = await avatarDao.getAvatarPath(userDetail.AvatarID);

    res.locals.profileavatar = avatar.AvatarPath;
    res.locals.profileusername = userDetail.UserName;
    res.locals.introduction = userDetail.AboutMeDescription;
    res.locals.birthday = userDetail.DateOfBirth;
    res.locals.title = "Analytics";

    //getting total users this.user has subscribed to. [Basically: Following]  (STATUS == WORKS!!)
    const totalUsersSubscribedTo = await followingDao.getTotalSubscribedToByUsername(username);
    res.locals.totalUsersSubscribedTo = totalUsersSubscribedTo.TotalSubscribedTo;

    //getting total subscribers this.user has [Basically: Followers]  (STATUS == WORKS!!)
    const totalSubscribers = await followersDao.getTotalSubscribersByUsername(username);
    res.locals.totalSubscribers = totalSubscribers.TotalSubscribers;


    //getting total number of comments this.user(author) has gotten in ALL his articles. (STATUS == UNKNOWN - REQUIRES TESTING!)
    const totalComments = await analyticsDao.getTotalCommentsByUsername(username);
    if (totalComments == undefined) {
        console.log("This user's articles has gotten 0 comments");

        //making totalComments = 0 since this user's articles has gotten 0 comments.
        res.locals.totalComments = 0;
    }
    else {
        res.locals.totalComments = totalComments.TotalComments
    };


    //getting total number of likes this.user(author) has gotten in ALL his articles. (STATUS == UNKNOWN - REQUIRES TESTING!)
    const totalLikes = await analyticsDao.getTotalLikesByUsername(username);
    if (totalLikes == undefined) {
        console.log("This user's articles has gotten 0 likes");

        //making totalLikes = 0 since this user's articles has gotten 0 likes.
        res.locals.totalLikes = 0;
    }
    else {
        res.locals.totalLikes = totalLikes.TotalLikes
    };
    const top3article=await analyticsDao.getTop3PopularArticlesByUsername(username);
    res.locals.top3article=top3article;
    

    //getting total number of comments this.user(author) has gotten per day. (STATUS == UNKNOWN - REQUIRES TESTING!)
    const totalDailyComments = await analyticsDao.getTotalDailyCommentsByUsername(username); 

    res.locals.isCurrentUser = req.session.username === username;

    res.render("analytics");
});

router.get('/getchartinformation',async function(req,res){
    const username=req.session.username;
    const totalDailyComments = await analyticsDao.getTotalDailyCommentsByUsername(username);
    console.log(totalDailyComments); 
    res.json(totalDailyComments);
   
});


router.get('/following', async function (req, res) {
    await handleFollow(req, res);
});

router.get('/followers', async function(req, res) {
    await handleFollow(req, res);
});

async function handleFollow(req, res) {
    const username = req.query.username;
    const userDetail = await usersDao.getUserDetailsByUserName(username);
    const avatar = await avatarDao.getAvatarPath(userDetail.AvatarID);
    const title = req.path.substring(1);
    res.locals.profileavatar = avatar.AvatarPath;
    res.locals.profileusername = userDetail.UserName;
    res.locals.introduction = userDetail.AboutMeDescription;
    res.locals.birthday = userDetail.DateOfBirth;
    res.locals.title = title;

    const totalUsersSubscribedTo = await followingDao.getTotalSubscribedToByUsername(username);
    res.locals.totalUsersSubscribedTo = totalUsersSubscribedTo.TotalSubscribedTo;

    const totalSubscribers = await followersDao.getTotalSubscribersByUsername(username);
    res.locals.totalSubscribers = totalSubscribers.TotalSubscribers;
    res.locals.isCurrentUser = req.session.username === username;

    let followUsers = [];
    if (title === 'following') {
        followUsers = await followingDao.getAllSubscribedToByUsername(username);
    } else {
        followUsers = await followersDao.getAllSubscribers(username);
    }
    res.locals.allUsersSubscribedTo = followUsers;
    res.render('follow');
}

module.exports = router;