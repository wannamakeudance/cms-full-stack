/**
 * 
 * @author Shakeel Ali
 */

const res = require("express/lib/response");
const SQL = require("sql-template-strings");
const dbPromise = require("../database.js");


//This function gets ALL the notification sorted from isNotificationSeen = FALSE and NotificationSentDateTimeDESC given a UserName

async function getAllNotificationByUsername (username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT US.UserName, US.NotificationTypeID, US.NewArticleID, US.NotificationFrom, US.NotificationMessage, US.NotificationSentDateTime, US.isNotificationSeen, A.AvatarPath
    FROM UserNotification AS 'US'
    INNER JOIN UserAccount AS 'UA'
    ON US.NotificationFrom = UA.UserName
    INNER JOIN Avatar AS 'A'
    ON UA.AvatarID = A.AvatarID
    WHERE US.UserName = ${username}
    ORDER BY isNotificationSeen ASC, NotificationSentDateTime DESC `);
    return result;
};



//This function gets the total unseen notification by a user [FOR: Notification Bell Icon]
async function getTotalUnseenNotificationByUserName(userName){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT UserName, COUNT(UserName) AS 'UnseenNotification'
    FROM UserNotification
    WHERE UserName = ${userName} AND isNotificationSeen = "F"`);
    return result;
};



/*This function changes the isNotificationSeen from "F" to "T"

    NOTE 1: For Notification TypeID put:
            A. "1" for New Article.
            B. "2" for New Comment.
            C. "3" for New Subscriber.
    
    NOTE 2: For articleID put:
            A. Put the actual articleID if it is a Comment or a New Article notification
            B. Put "null" if it a New Subscriber notification

*/
async function changeNotificationStatus(username, NotificationTypeID, articleID, notificationFrom){
    const db = await dbPromise;
    
    //This will change the isNotificationSeen to "T" when a user sees the New Subscriber notification. It is important to put articleID value as "null" in the parameter in all small.
    if(articleID == "null"){
    const result = await db.run(SQL `
    UPDATE UserNotification
    SET isNotificationSeen = "T"
    WHERE UserName = ${username} AND NotificationTypeID = "3" AND NewArticleID IS NULL AND NotificationFrom = ${notificationFrom}`);
    return result;
    }
    
    //This will change the isNotificationSeen to "T" when a user sees the new article or new comment. Put the articleID value as the actual articleID.
    else{
    const result = await db.run(SQL `
    UPDATE UserNotification
    SET isNotificationSeen = "T"
    WHERE UserName = ${username} AND NotificationTypeID = ${NotificationTypeID} AND NewArticleID = ${articleID} AND NotificationFrom = ${notificationFrom}`);
    return result;}
}


//Export function.
module.exports = {
    getAllNotificationByUsername,
    getTotalUnseenNotificationByUserName,
    changeNotificationStatus
};