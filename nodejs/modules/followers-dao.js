/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");



//This function gets this.users subscribers (followers)
async function getAllSubscribers (username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT US.UserName, UA.AboutMeDescription, A.AvatarPath
    FROM UserSubscription AS 'US'
    INNER JOIN UserAccount AS 'UA'
    ON US.UserName = UA.UserName
    INNER JOIN Avatar AS 'A'
    ON UA.AvatarID = A.AvatarID
    WHERE US.SubscribedTo = ${username}
    ORDER BY US.UserName ASC`);
    return result;
}

//This function gets the total subscribers a user has (Followers)
async function getTotalSubscribersByUsername (userName){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT COUNT (SubscribedTo) AS 'TotalSubscribers'
    FROM UserSubscription
    WHERE SubscribedTo = ${userName}`)
    return result;
}





   // Export functions.
   module.exports = {
  getAllSubscribers,
  getTotalSubscribersByUsername
   };