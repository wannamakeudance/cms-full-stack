/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("../database.js");



/*This function inserts a new article notifcation in the database.
    NOTE: The username is the person who will be getting the notification. The notificationFrom is the username of the person who just created a new article (Author).
*/

async function insertNewArticleNotification (username, newArticleID, notificationFrom, notificationMessage){
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserNotification(UserName, NotificationTypeID, NewArticleID, NotificationFrom, NotificationMessage)
    VALUES (${username}, 1, ${newArticleID}, ${notificationFrom}, ${notificationMessage})`);
    return result;
}




//Export function.
module.exports = {
    insertNewArticleNotification
};
