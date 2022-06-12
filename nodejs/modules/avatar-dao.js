/**
 * 
 * @author Shakeel Ali
 */

const res = require("express/lib/response");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

/**
 * Inserts the given avatar into the database. 
 */

async function createAvatar(avatarID, avatarName, avatarPath){
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO Avatar
    VALUES (${avatarID},${avatarName}, ${avatarPath})`);
    return result;
}


//This function returns the AvatarPath given an AvatarID
async function getAvatarPath(avatarID){
    const db = await dbPromise;
    const result = await db.get(SQL `
   SELECT AvatarPath
   FROM Avatar
   WHERE AvatarID = ${avatarID}`);
   return result;
    };


//This function selects everything in the Avatar entity
async function getAllAvatarDetails(){
    const db = await dbPromise;
    const result = await db.all(SQL `
   SELECT *
   FROM Avatar
   WHERE AvatarID NOT LIKE "5"`);
   return result;
    };


//This function UPDATES the path of the avatar given the avatarID and new avatarPath
async function updateAvatarPath(avatarID, avatarPath){
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE Avatar
    SET AvatarPath = ${avatarPath}
    WHERE AvatarID = ${avatarID}`)
    return result;
}

//This function DELETES the Avatar given the AvatarID
async function deleteAvatarByID(avatarID){
    const db = await dbPromise;
    const result = await db.run(SQL `
   DELETE FROM Avatar
   WHERE AvatarID = ${avatarID}`)
   return result;
    };

    // Export functions.
module.exports = {
    createAvatar,
    getAvatarPath,
    getAllAvatarDetails,
    updateAvatarPath,
    deleteAvatarByID
};