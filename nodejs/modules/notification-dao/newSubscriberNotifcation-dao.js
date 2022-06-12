/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("../database.js");



/*This function inserts a new subscriber notification
    NOTE: The username is the person who will be getting the notification. The notificationFrom is the username of the person who just subscribed (subscriber).
*/
async function insertNewSubscriberNotification(username, notificationFrom, notificationMessage){
    const db = await dbPromise;
    console.log(username, notificationFrom, notificationMessage)
    const result = await db.run(SQL `
    INSERT INTO UserNotification (UserName, NotificationTypeID, NotificationFrom, NotificationMessage)
    VALUES (${username}, 3, ${notificationFrom}, ${notificationMessage})`);
    return result;
};



//Export function.
module.exports = {
    insertNewSubscriberNotification
};