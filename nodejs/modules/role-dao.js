/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function CREATES a role given a roleID and roleDescription
async function createUserRole(UserRoleID, roleDescription){
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserRole 
    VALUES (${UserRoleID}, ${roleDescription})`)
    return result;
};


//This function UPDATES a roleDescription given a roleID and new roleDescription
async function updateUserRole(UserRoleID, roleDescription){
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE UserRole
    SET UserDescription = ${roleDescription}
    WHERE UserRoleID = ${UserRoleID}` )
    return result;
}


//This function DELETES a role given a roleID
async function deleteUserRole(UserRoleID){
    const db = await dbPromise;
    const result = await db.run(SQL `
    DELETE FROM UserRole
    WHERE UserRoleID = ${UserRoleID}` )
    return result;
}











// Export functions.
module.exports = {
    createUserRole,
    updateUserRole,
    deleteUserRole
};