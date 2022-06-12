/**
 * 
 * @author Shakeel Ali
 */

const { append } = require("express/lib/response");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const { insertUserPassword } = require("./userPassword-dao.js");

/**
 * Inserts the given user into the database. 
 */

async function createUserAccount(userName, FirstName, LastName, DateOfBirth, AboutMeDescription, UserRoleID, AvatarID){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserAccount
    VALUES (${userName}, ${FirstName}, ${LastName}, ${DateOfBirth}, ${AboutMeDescription}, ${UserRoleID}, ${AvatarID}, ${myDate}, ${myDate}
    )`);
    return result;
};



//This function updates a row of user details given the userName
async function updateUserAccount(userName, FirstName, LastName,DateOfBirth, AboutMeDescription, UserRoleID, AvatarID){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE UserAccount
    SET UserName=${userName},
        FirstName = ${FirstName},
        LastName = ${LastName},
        DateOfBirth = ${DateOfBirth},
        AboutMeDescription = ${AboutMeDescription},
        UserRoleID = ${UserRoleID},
        AvatarID = ${AvatarID},
        ModifiedDateTime = ${myDate}
    WHERE UserName = ${userName}`);
    return result;
};



//This function updates the AvatarID of the user.
async function updateAvatarID(userName, newAvatarID){
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE UserAccount
    SET AvatarID = "${newAvatarID}"
    WHERE userName = "${userName}"`);
    return result;
}




//This function DELETES the user.
async function deleteUser(userName){
    const db = await dbPromise;
    const result = await db.run(SQL `
    DELETE FROM UserAccount
    WHERE userName = ${userName}`);
    return result;
}


//This function SELECTS ALL UserName
async function getAllUserName(){
    const db = await dbPromise;
    const result = await db.all(SQL `
   SELECT UserName
   FROM UserAccount`);
   return result;
}


//This function gives all the details of ALL the Users
async function getAllUserAccountsDetails(){
    const db = await dbPromise;
    const result = await db.all(SQL `
   SELECT *
   FROM UserAccount`);
   return result;
}

//This function gives all the details of a user given the UserName
async function getUserDetailsByUserName(userName){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT *
    FROM UserAccount
    WHERE UserName = ${userName}`);
    return result;
}

 function getSQLiteDate (){
    var date = new Date();
    var sqllite_date = date.toISOString();
    var result = sqllite_date.replace("T"," ");
    var result = result.split(".")[0];
    return result;
}




// Export functions.
module.exports = {
    createUserAccount,
    updateUserAccount,
    updateAvatarID,
    deleteUser,
    getAllUserName,
    getAllUserAccountsDetails,
    getUserDetailsByUserName,
    getSQLiteDate
};



