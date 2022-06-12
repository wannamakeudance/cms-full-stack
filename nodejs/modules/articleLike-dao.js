/**
 * 
 * @author Shakeel Ali
 */

const res = require("express/lib/response");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");



//This function INSERTS a like into the database.
async function insertLike(articleID, likedByID){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO ArticleLike 
    VALUES (${articleID}, ${likedByID}, ${myDate})`);
    return result;
}



//This function DELETES a like into the database.
async function deleteLike(articleID, likedByID){
    const db = await dbPromise;
    const result = await db.run(SQL `
    DELETE FROM ArticleLIKE
    WHERE ArticleID = ${articleID} AND LikedByID = ${likedByID}`);
    return result;
}


async function getArticlesLikedByUser (userID){
    const db = await dbPromise;
    const result = await db.all(SQL `SELECT A.ArticleID
        FROM ArticleLike as "AL", Article as "A"
        WHERE AL.LikedByID = ${userID} 
        AND AL.ArticleID = A.ArticleID`)
    return result;
}

// Export functions.
module.exports = {
    insertLike,
    deleteLike,
    getArticlesLikedByUser
};










//SQL_Friendly && User_Friendly dateTime conversion function.
function getSQLiteDate (){
    var date = new Date();
    var sqllite_date = date.toISOString();
    var result = sqllite_date.replace("T"," ");
    var result = result.split(".")[0];
    return result;
}




