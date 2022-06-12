/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function gets role UserDescription of a UserAccount given the UserName
async function getRoleUserDescriptionByRoleID(userName){
    const db = await dbPromise;
    const result = await db.get(SQL `
   SELECT R.UserDescription
   FROM UserAccount AS "UA"
   INNER JOIN UserRole AS "R"
   ON UA.UserRoleID = R.UserRoleID
   WHERE UserName = ${userName}`);
   return result;
    };



// Export functions.
module.exports = {
    getRoleUserDescriptionByRoleID
};