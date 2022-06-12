/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//This function gets AvatarPath of a UserAccount given the UserName
async function getAvatarPathByUserName(userName){
    const db = await dbPromise;
    const result = await db.get(SQL `
   SELECT A.AvatarPath
   FROM UserAccount AS "UA"
   INNER JOIN Avatar AS "A"
   ON UA.AvatarID = A.AvatarID
   WHERE UserName = ${userName}`)
   return result;
    };



// Export functions.
module.exports = {
    getAvatarPathByUserName
};