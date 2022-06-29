/**
 * @file the common functions which can be used in more than one page  
 * @author xiangzheng Jing 
 */

const followersDao = require('../modules/followers-dao.js');
const newCommentNotificationDao = require('../modules/notification-dao/newCommentNotification-dao');
const newArticleNotifcationDao = require('../modules/notification-dao/newArticleNotifcation-dao');
const newSubscriberNotifcationDao = require('../modules/notification-dao/newSubscriberNotifcation-dao');
const fs = require('fs');

/**
 * handle like status in the article list
 * 
 * @param {Array} list 
 * @param {Array} listLikedByUser 
 * @returns the list with liked status
 */
function likeStatusHandler(list, listLikedByUser) {

    let idsLikedByUser = [];

    listLikedByUser.forEach(item => {
        idsLikedByUser.push(item.ArticleID);
    });
    
    for (let i = 0; i < list.length; i++) {

        const current = list[i];

        // convert the coverImage to thumbnails
        list[i].ArticleImagePath = list[i].ArticleImagePath && list[i].ArticleImagePath.replace('coverImages', 'thumbnails');
        list[i].isLiked = idsLikedByUser.indexOf(current.ArticleID) !== -1;
   
    }
    return list;
}

/**
 * observation pattern
 * 
 * @param {number} notifcationType 
 * @param {string} username
 * @returns {boolean} true represent success, on the contrary, false is failed.
 */
async function notifyHandler({
    notifcationType, 
    username, 
    articleID,
    subscriberName
}) {
    try {

        if (notifcationType === 3) {
           
            await newSubscriberNotifcationDao.insertNewSubscriberNotification(subscriberName, username, 'Started following you');
        
        } else {
            
            const subscribers = await followersDao.getAllSubscribers(username);
            
            for (let i = 0; i < subscribers.length; i++) {
                
                const subscriber = subscribers[i];
                const _subscriberName = subscriber.UserName;

                switch(notifcationType) {
                    case 1: 
                        await newArticleNotifcationDao.insertNewArticleNotification(_subscriberName, articleID, username, 'Created a new article');
                        break;
                    case 2:
                        await newCommentNotificationDao.insertCommentNotification(_subscriberName, articleID, username, 'Added a new comment');
                        break;
                }
            }
        }
        return true;
    } catch (error) {
        return;
    }
}

/**
 * resize the image file and rename it in a new location
 * 
 * @param {Object} fileInfo 
 * @param {Object} jimp 
 * @returns {string} newfilePath
 */
async function resizeImage(fileInfo, jimp) {

    const originalName = fileInfo.originalname;
    const extension = originalName.toLowerCase().substring(originalName.lastIndexOf("."));

    const oldFileName = fileInfo.path;
    const numberOfImages = fs.readdirSync("public/images/thumbnails").length;

    let newFileName = `./public/images/coverImages/image_${numberOfImages}${extension}`;
    if (oldFileName == 'defaultCover') {
        newFileName = `./public/images/coverImages/${oldFileName}${extension}`;
    }

    fs.renameSync(oldFileName, newFileName);

    const image = await jimp.read(newFileName);
    image.cover(320, 214, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
    await image.write(`./public/images/thumbnails/image_${numberOfImages}${extension}`)

    return `images/coverImages/image_${numberOfImages}${extension}`;     
}

/**
 * handle the comments list data
 * 
 * @param {Array} data 
 * @param {string} username 
 * @param {number} myarticle 
 * @returns {Array} the handled data
 */
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

module.exports = {
    likeStatusHandler,
    notifyHandler,
    resizeImage,
    commentsHandler
};