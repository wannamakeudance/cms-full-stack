/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function gets all the users this.user is subscribed to (following)
async function getAllSubscribedToByUsername (username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT US.SubscribedTo , UA.AboutMeDescription , A.AvatarPath
    FROM UserSubscription AS 'US'
    INNER JOIN UserAccount AS 'UA'
    ON US.SubscribedTo = UA.UserName
    INNER JOIN Avatar AS 'A'
    ON UA.AvatarID = A.AvatarID
    WHERE US.UserName = ${username}
    ORDER BY US.SubscribedTo ASC`);
    return result;
}


//This function gets the total users a user is subscribed to (Following).
async function getTotalSubscribedToByUsername(userName){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT COUNT(UserName) AS 'TotalSubscribedTo'
    FROM UserSubscription
    WHERE UserName = ${userName}`);
    return result;
}



//This function checks if a user is subscribedTo[following] another user.
async function checkIfUserIsSubscribedToAnother (userName, isPersonSubscribedToThisUser){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT *
    FROM UserSubscription
    WHERE UserName = ${userName} AND SubscribedTo = ${isPersonSubscribedToThisUser}`)
    return result;
};



   // Export functions.
   module.exports = {
  getAllSubscribedToByUsername,
  getTotalSubscribedToByUsername,
  checkIfUserIsSubscribedToAnother
   };