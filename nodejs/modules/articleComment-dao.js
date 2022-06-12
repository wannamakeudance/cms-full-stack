/**
 * 
 * @author Shakeel Ali
 */


const res = require("express/lib/response");
const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function inserts a Comment . NOTE: "The replyToID is the commentID which you are replying to"
async function insertComment (articleID, commentedByID, commentContent, replyToID){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    if(replyToID == "null"){
    const result = await db.run(SQL `
    INSERT INTO ArticleComment(ArticleID, CommentedByID, CommentContext, CreatedDateTime, ModifiedDateTime)
    VALUES (${articleID}, ${commentedByID}, ${commentContent}, ${myDate}, ${myDate})`);
    return result;}

    else{
        const result = await db.run(SQL `
        INSERT INTO ArticleComment(ArticleID, CommentedByID, CommentContext, ReplyToID, CreatedDateTime, ModifiedDateTime)
        VALUES (${articleID}, ${commentedByID}, ${commentContent}, ${replyToID}, ${myDate}, ${myDate})`);
        return result;}
    }





//This fuction UPDATES a comment by commentID
async function updateCommentByCommentID (commentID, commentContent){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    UPDATE ArticleComment
    SET CommentContext = ${commentContent}, ModifiedDateTime = ${myDate}
    WHERE CommentID = ${commentID}`);
    return result;
}


//This function DELETES a comment by commentID
async function deleteCommentByCommentID (commentID){
    const db = await dbPromise;
    const result = await db.run (SQL `
    DELETE FROM ArticleComment
    WHERE CommentID = ${commentID}`);
    return result
}


//This function gets an Article with parameter supplied ArticleID.
async function getArticleByArticleID(articleID){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleContent AS 'ArticleContent', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath'
	FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
    HAVING A.ArticleID = ${articleID}`);
    return result
}


//This function gets all comments of an article given an ArticleID
async function getArticleCommentsByArticleID(articleID){
    const db = await dbPromise;
    
    const result = await db.all(SQL `
    SELECT AC.CommentID AS 'CommentID', AC.ArticleID AS 'ArticleID', AC.CommentedByID AS 'CommentedByID', AC.CommentContext AS 'CommentContext', 
    AC.ReplyToID AS 'ReplyToID', AC.CreatedDateTime AS 'CreatedDateTime', AC.ModifiedDateTime AS 'ModifiedDateTime', UA.AvatarID AS 'AvatarID', A.AvatarPath AS 'AvatarPath'
    FROM ArticleComment AS "AC"
    INNER JOIN UserAccount AS "UA"
    ON AC.CommentedByID = UA.UserName
    INNER JOIN Avatar AS "A"
    ON UA.AvatarID = A.AvatarID
    WHERE AC.ArticleID = ${articleID}
    ORDER BY CreatedDateTime DESC`);
    const commentTreeFunction = commentTree(result)
    var a = mySortingFunction(commentTreeFunction)
    return a;
}


/*

    For getCommentsByArticleID(articleID)
        1. You need to be able to show the Avatar of Parent Commenter && the Avatar of Child Commenters.
        2. Sorting Order? Newest to Oldest --> Parent Comment (By Created Date) 
        2. In order to test this, create some dummy data.
        3. Also, you need it to be in a tree like structure

*/



//This function sorts comments in a tree like structure.

function commentTree (result){
    const unflatten = data => {
        const tree = data.map(e => ({...e}))
          .sort((a, b) => a.CommentID - b.CommentID)
          .reduce((a, e) => {
            a[e.CommentID] = a[e.CommentID] || e;
            a[e.ReplyToID] = a[e.ReplyToID] || {};
            const parent = a[e.ReplyToID];
            parent.children = parent.children || [];
            parent.children.push(e);
            return a;
          }, {})
        ;
        return Object.values(tree)
            .find(e => {if (e && e.CommentID === undefined) {return e.children}})
      };
      
      const unflatten2 = unflatten(result)
      return unflatten2;
}



//This function sorts the comment by CreatedDateTime
function mySortingFunction(myArray){
    if (!myArray) {
        return;
    }
    for(let i = 0; i < myArray.length; i++){
        for(let j = 0; j < (myArray.length - i -1); j++){
            if(myArray[j].CreatedDateTime < myArray[j + 1].CreatedDateTime){
                var temp = myArray[j];
                myArray[j] = myArray[j + 1];
                myArray[j + 1] = temp
            }
        }
    }
    return myArray;
}


 // Export functions.
    module.exports = {
    insertComment,
    updateCommentByCommentID,
    deleteCommentByCommentID,
    getArticleByArticleID,
    getArticleCommentsByArticleID, 
    
};

























//SQL_Friendly && User_Friendly dateTime conversion function.
function getSQLiteDate (){
    var date = new Date();
    var sqllite_date = date.toISOString();
    var result = sqllite_date.replace("T"," ");
    var result = result.split(".")[0];
    return result;
}


