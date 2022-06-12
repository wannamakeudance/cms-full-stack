/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");



//This function inserts a subscriber. The userName here is the person who is subscribing and the SubscribedTo is the person who you(userName) are subscribing to.
async function insertSubscriber(userName, SubscribedTo){
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserSubscription (UserName, SubscribedTo)
    VALUES (${userName}, ${SubscribedTo})`);
    return result;
};


//This function unsubscribes(removes) a user from a user he/she was subscribed to before.
async function removeSubscription(userName, SubscribedTo){
    const db = await dbPromise;
    const result = await db.run(SQL `
    DELETE FROM UserSubscription
    WHERE UserName = ${userName} AND SubscribedTo = ${SubscribedTo}`);
    return result;
}


// Export functions.
module.exports = {
    insertSubscriber,
    removeSubscription
};