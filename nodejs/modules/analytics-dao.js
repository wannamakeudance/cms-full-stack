/**
 * 
 * @author Shakeel Ali
 */

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//This function gets the total number of comments this.user(Author) has gotten in ALL his articles
async function getTotalCommentsByUsername (username){
    const db = await dbPromise;
    const result = await db.get (SQL `  
    SELECT COUNT(AC.ArticleID) AS 'TotalComments'
    FROM ArticleComment AS 'AC'
    INNER JOIN Article AS 'A'
    ON AC.ArticleID = A.ArticleID
    GROUP BY A.ArticleCreator
    HAVING A.ArticleCreator = ${username}`);
    return result
}



//This function gets the total number of likes this.user(Author) has gotten in ALL his articles.
async function getTotalLikesByUsername (username){
    const db = await dbPromise;
    const result = await db.get(SQL `
    SELECT COUNT (AL.ArticleID) AS 'TotalLikes'
    FROM ArticleLike AS 'AL'
    INNER JOIN Article AS 'A'
    ON AL.ArticleID = A.ArticleID
    GROUP BY A.ArticleCreator
    HAVING A.ArticleCreator = ${username}`)
    return result;
}


//This function gets the total number of comments this.user has gotten per day in ALL his articles.
async function getTotalDailyCommentsByUsername (username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT strftime("%Y",AC.CreatedDateTime) || "-"|| strftime("%m",AC.CreatedDateTime) || "-" || strftime("%d",AC.CreatedDateTime) AS 'DailyDate',COUNT(AC.ArticleID) AS 'TotalComments'
    FROM ArticleComment AS 'AC'
    INNER JOIN Article AS 'A'
    ON AC.ArticleID = A.ArticleID
    GROUP BY A.ArticleCreator, DailyDate
    HAVING A.ArticleCreator = ${username}
    ORDER BY DailyDate
    LIMIT 7 `);
    return result;
}


//This function gets the Top 3 post popular articles by a user (Author).  --Formula Used: TotalLikes + TotalComments = PopularityRating  
    //NOTE: The ranking order is already sorted. So first item is 1st, then second item is 2nd and third item is 3rd.

async function getTop3PopularArticlesByUsername(username){
    const db = await dbPromise;
    const result = await db.all (SQL `
    SELECT ArticleID, ArticleTitle, ArticleCreator, ArticleImagePath, CreatedDateTime, TotalLikes, TotalComments,  TotalLikes + TotalComments  AS 'PopularityRating'
    FROM (
    SELECT A.ArticleID, A.ArticleTitle, A.ArticleCreator, A.ArticleImagePath, A.CreatedDateTime, COUNT(AL.ArticleID) AS 'TotalLikes' , COUNT(AC.ArticleID) AS 'TotalComments'
    FROM Article AS "A"
    LEFT JOIN ArticleLike AS "AL"
    ON A.ArticleID = AL.ArticleID
    LEFT JOIN ArticleComment AS "AC"
    ON A.ArticleID = AC.ArticleID
    GROUP BY A.ArticleID 
    HAVING A.ArticleCreator = ${username}) AS SUBQUERY
    ORDER BY PopularityRating DESC
    LIMIT 3`);

    if(result == undefined){
        const result = "Sorry, you have no articles!"
        return result;
    }
    else{
    return result;
    }
}



// Export functions.
module.exports = {
    getTotalCommentsByUsername,
    getTotalLikesByUsername,
    getTotalDailyCommentsByUsername,
    getTop3PopularArticlesByUsername

    
};