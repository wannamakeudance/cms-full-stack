/**
 * 
 * @author Shakeel Ali
 */



const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");




//This fuction INSERTS an article into the database
//NOTE: ArticleID is automatically inserted.

async function insertArticle(articleTitle, articleCreator, articleContent, articleImagePath){
    const myDate = getSQLiteDate();
    const db = await dbPromise;
    const result = await db.run(SQL `
    INSERT INTO Article(ArticleTitle,ArticleCreator,ArticleContent,ArticleImagePath, CreatedDateTime, ModifiedDateTime)
    VALUES (${articleTitle}, ${articleCreator}, ${articleContent}, ${articleImagePath}, ${myDate}, ${myDate})`);
    return result;
};



//This function DELETES an article given an articleID from a database.

async function deleteArticleByID(articleID){
    const db = await dbPromise;
    const result = await db.run(SQL `
    DELETE FROM Article
    WHERE ArticleID = ${articleID}`);
    return result;
}



//This function UPDATES an article's [Title, Content, ImagePath] given and ArticleID

async function updateArticleByID(articleID,articleTitle,articleContent,articleImagePath){
    const db = await dbPromise;
    const myDate = getSQLiteDate();
    const result = await db.run(SQL `
    UPDATE Article
    SET ArticleTitle = ${articleTitle},
        ArticleContent = ${articleContent},
        ArticleImagePath = ${articleImagePath},
        ModifiedDateTime = ${myDate}
    WHERE ArticleID = ${articleID}
    `);
    return result;
}




/* For HOME PAGE DISPLAY USE THESE:

1. getAllArticlesByNewest() --> newest means that by newest CreateDateTime
2. getAllArticlesByOldest() --> oldest means by oldest CreateDateTime
3. the sorting method for "Username" was ambiguous so I made both:
    A. getArticlesByUserNameAsc() --> From A-Z
    B. getArticlesByUserNameDes() --> From Z-A
4. the sorting method for "Title" was ambiguous so I made both:
    A. getArticlesByArticleTitleAsc() --> From A-Z
    B. getArticlesByArticleTitleDes() --> From Z-A

*/



//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by CreatedDateTime in ascending order. Ideal For: HOME PAGE
async function getAllArticlesByNewest(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', 
        COUNT(AL.ArticleID) AS 'TotalLikes', 
        A.ArticleTitle AS 'ArticleTitle', 
        A.ArticleCreator AS 'ArticleCreator', 
        A.ArticleImagePath AS 'ArticleImagePath', 
        A.CreatedDateTime AS 'CreatedDateTime', 
        UA.AvatarID AS 'AvatarID', 
        AV.AvatarPath AS 'AvatarPath',
        A.ArticleContent AS 'ArticleContent'
	FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY A.CreatedDateTime DESC `);
    return result;
}





//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by CreatedDateTime in ascending order. Ideal For: HOME PAGE
async function getAllArticlesByOldest(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
    A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY A.CreatedDateTime`);
    return result;
}





//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleCreator in ascending order. Ideal For: HOME PAGE
async function getAllArticlesByUserNameAsc(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
    A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY UPPER(A.ArticleCreator)`);
    return result;
}




//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleCreator in descending order. Ideal For: HOME PAGE
async function getAllArticlesByUserNameDes(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath'
	FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY UPPER(A.ArticleCreator) DESC`);
    return result;
}



//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleTitle in ascending order. Ideal For: HOME PAGE
async function getAllArticlesByArticleTitleAsc(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
    A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY UPPER(A.ArticleTitle)`);
    return result;
}


//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleTitle in descending order. Ideal For: HOME PAGE
async function getAllArticlesByArticleTitleDes(){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath'
	FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
	ORDER BY UPPER(A.ArticleTitle) DESC`);
    return result;
}




/* FOR MY ARTICLE USE THESE:

1. getAllArticlesByNewestByUserName(username) --> newest means that by newest CreateDateTime for given parameter specified UserName.
2. getAllArticlesByOldestByUserName(username) --> oldest means by oldest CreateDateTime for given parameter specified UserName.
3. the sorting method for "Title" was ambiguous so I made both:
    A. getArticlesByArticleTitleAscByUserName(username) --> From A-Z for given parameter specified UserName.
    B. getArticlesByArticleTitleDesByUserName(username) --> From Z-A for given parameter specified UserName.

*/

//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by CreatedDateTime in ascending order. Ideal For: User's Own Articles' Catalogue.
async function getAllArticlesByOldestByUserName(username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
	A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
    HAVING A.ArticleCreator = ${username}
	ORDER BY A.CreatedDateTime`);
    return result;
}




//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by CreatedDateTime in ascending order. Ideal For: User's Own Articles Catalogue.
async function getAllArticlesByNewestByUserName(username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
	A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
    HAVING A.ArticleCreator = ${username}
	ORDER BY A.CreatedDateTime DESC`);
    return result;
}





//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleTitle in ascending order. Ideal For: User's Own Articles Catalogue.
async function getAllArticlesByArticleTitleAscByUserName(username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
	A.ArticleContent AS 'ArticleContent'
    FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
    HAVING A.ArticleCreator = ${username}
	ORDER BY UPPER(A.ArticleTitle)`);
    return result;
}




//This function gets ALL Articles, its ArticleCreators and TotalLikes sorted by ArticleTitle in descending order. Ideal For: User's Own Articles Catalogue.
async function getAllArticlesByArticleTitleDesByUserName(username){
    const db = await dbPromise;
    const result = await db.all(SQL `
    SELECT A.ArticleID AS 'ArticleID', COUNT(AL.ArticleID) AS 'TotalLikes', A.ArticleTitle AS 'ArticleTitle', A.ArticleCreator AS 'ArticleCreator', A.ArticleImagePath AS 'ArticleImagePath', A.CreatedDateTime AS 'CreatedDateTime', UA.AvatarID AS 'AvatarID', AV.AvatarPath AS 'AvatarPath',
    A.ArticleContent AS 'ArticleContent'
	FROM Article AS "A"
	LEFT JOIN ArticleLike AS "AL"
	ON A.ArticleID = AL.ArticleID
    INNER JOIN UserAccount AS "UA"
    ON A.ArticleCreator = UA.UserName
    INNER JOIN Avatar AS "AV"
    ON UA.AvatarID = AV.AvatarID
    GROUP BY A.ArticleID
    HAVING A.ArticleCreator = ${username}
	ORDER BY UPPER(A.ArticleTitle) DESC`);
    return result;
}




//This function gets the LATEST article of a username (Author/ArticleCreator)
async function getLatestArticleByUserName (username){
    const db = await dbPromise;
    const result = await db.get (SQL `
    SELECT *
    FROM Article
    WHERE ArticleCreator = ${username}
    ORDER BY CreatedDateTime DESC
    LIMIT 1`)
    return result;
}






































//SQL_Friendly && User_Friendly dateTime conversion function.
function getSQLiteDate (){
    var date = new Date();
    var sqllite_date = date.toISOString();
    var result = sqllite_date.replace("T"," ");
    var result = result.split(".")[0];
    return result;
}




//Export function.
module.exports = {
    insertArticle,
    deleteArticleByID,
    updateArticleByID,
    getAllArticlesByNewest,
    getAllArticlesByOldest,
    getAllArticlesByUserNameAsc,
    getAllArticlesByUserNameDes,
    getAllArticlesByArticleTitleAsc,
    getAllArticlesByArticleTitleDes,

    //ByUserName:
    getAllArticlesByOldestByUserName,
    getAllArticlesByNewestByUserName,
    getAllArticlesByArticleTitleAscByUserName,
    getAllArticlesByArticleTitleDesByUserName,

    //UserForSendingNotification:
    getLatestArticleByUserName,
};

