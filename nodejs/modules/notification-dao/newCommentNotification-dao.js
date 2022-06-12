/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("../database.js");

/*This function inserts a new comment notification in the database.
    NOTE: The username is the person who will be getting the notification. The notificatonFrom is the username of the person who this.user IS SUBSCRIBED TO AND JUST COMMENTED
*/


async function insertCommentNotification (username, articleCommentedOnID, notificationFrom, notificationMessage){
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserNotification(UserName, NotificationTypeID, NewArticleID, NotificationFrom, NotificationMessage)
    VALUES (${username}, 2 , ${articleCommentedOnID}, ${notificationFrom}, ${notificationMessage})`);
    return result;
};


//Export function.
module.exports = {
    insertCommentNotification,
};