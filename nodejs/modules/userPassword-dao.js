/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function INSERTS a user's password in the UserPassword entity
async function insertUserPassword(userName, passwordSalt, passWord ){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO UserPassword (UserName, PasswordSalt, PassWord, ModifiedDateTime)
    VALUES (${userName}, ${passwordSalt}, ${passWord}, ${myDate})`);
    return result;
};


//This function UPDATES a user's password given the userName
async function updateUserPassword(userName, passwordSalt, newPassword){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE UserPassword
    SET PasswordSalt = ${passwordSalt},
        Password = ${newPassword},
        ModifiedDateTime = ${myDate}
    WHERE UserName = ${userName}`)
    return result;
};


//This function gives the PasswordSalt given a UserName
async function getPasswordSaltByUsername (UserName){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT PasswordSalt
    FROM UserPassword
    WHERE UserName = ${UserName}`)
    return result;
};


//This function gives the Password given a UserName NOTE: You might not want to directly match password entered with actuall password.
async function getPasswordByUsername (UserName){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT Password
    FROM UserPassword
    WHERE UserName = ${UserName}`)
    return result;
};

async function getAuthTokenByUsername(userName, authToken) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT AuthToken FROM UserPassword
        WHERE UserName = ${userName}`);
    return result;
}

async function updateAuthTokenByUsername(userName, authToken) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        UPDATE UserPassword
        SET AuthToken = ${authToken}
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



//Export functions.
module.exports = {
    insertUserPassword,
    updateUserPassword,
    getPasswordSaltByUsername,
    getPasswordByUsername,
    getAuthTokenByUsername,
    updateAuthTokenByUsername
};