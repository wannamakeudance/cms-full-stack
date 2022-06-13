/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

DROP TABLE IF EXISTS UserAccount;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS UserPassword;
DROP TABLE IF EXISTS Avatar;
DROP TABLE IF EXISTS Article;
DROP TABLE IF EXISTS ArticleLike;
DROP TABLE IF EXISTS ArticleComment;
DROP TABLE IF EXISTS UserSubscription;
DROP TABLE IF EXISTS NotificationType;
DROP TABLE IF EXISTS UserNotification;




--CREATING UserRole ENTITY

CREATE TABLE UserRole (
    UserRoleID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    UserDescription TEXT NOT NULL
);

--INSERTING into UserRole ENTITY TO TEST
INSERT INTO UserRole (UserRoleID, UserDescription)
VALUES (1, "Admin");

INSERT INTO UserRole (UserRoleID, UserDescription)
VALUES (2, "Users");





--CREATING Avatar ENTITY

CREATE TABLE Avatar (
    AvatarID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    AvatarName VARCHAR(50),
    AvatarPath TEXT NOT NULL
);

--INSERTING into Avatar Entity to TEST.      @@@@@ Xiangzheng Jing ADD ALL THE AVATAR HERE. 
INSERT INTO Avatar (AvatarID, AvatarName, AvatarPath)
VALUES (1, "Orange" ,"https://www.w3schools.com/w3images/avatar6.png");

INSERT INTO Avatar (AvatarID, AvatarName, AvatarPath)
VALUES (2, "Red" ,"https://www.w3schools.com/w3images/avatar5.png");

INSERT INTO Avatar (AvatarID, AvatarName, AvatarPath)
VALUES (3, "Green" ,"https://www.w3schools.com/w3images/avatar4.png");

INSERT INTO Avatar (AvatarID, AvatarName, AvatarPath)
VALUES (4, "Blue" ,"https://www.w3schools.com/w3images/avatar3.png");

INSERT INTO Avatar (AvatarID, AvatarName, AvatarPath)
VALUES (5, "Default", "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png");




--CREATING UserAccount ENTITY

CREATE TABLE UserAccount (
    UserName VARCHAR(30) PRIMARY KEY NOT NULL,
    FirstName VARCHAR(40) NOT NULL,
    LastName VARCHAR(40) NOT NULL,
    DateOfBirth DATE,
    AboutMeDescription TEXT,
    UserRoleID INTEGER NOT NULL,
    AvatarID INTEGER NOT NULL,
    CreatedDateTime DATETIME NOT NULL,
    ModifiedDateTime DATETIME,
    FOREIGN KEY (UserRoleID) REFERENCES UserRole(UserRoleID)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (AvatarID) REFERENCES Avatar(AvatarID)
        ON DELETE NO ACTION ON UPDATE NO ACTION

);


--CREATING dummy UserAccount for dummy Articles
INSERT INTO UserAccount (UserName, FirstName, LastName, UserRoleID, AvatarID, AboutMeDescription, DateOfBirth, CreatedDateTime, ModifiedDateTime)
VALUES ("user1", "Olivia", "Jing", 1, 2, "About Me", "2000-01-01", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO UserAccount (UserName, FirstName, LastName, UserRoleID, AvatarID, AboutMeDescription, DateOfBirth, CreatedDateTime, ModifiedDateTime)
VALUES ("user2", "Mike", "Wheeler", 2, 1, "Finn in Stranger Things", "2000-01-02", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO UserAccount (UserName, FirstName, LastName, UserRoleID, AvatarID, AboutMeDescription, DateOfBirth, CreatedDateTime, ModifiedDateTime)
VALUES ("user3", "Ele", "Eleven", 2, 3, "Millie in Stranger Things", "2000-01-03", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO UserAccount (UserName, FirstName, LastName, UserRoleID, AvatarID, AboutMeDescription, DateOfBirth, CreatedDateTime, ModifiedDateTime)
VALUES ("user4", "Will", "Byers", 2, 4, "Noah in Stranger Things", "2000-01-04", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO UserAccount (UserName, FirstName, LastName, UserRoleID, AvatarID, AboutMeDescription, DateOfBirth, CreatedDateTime, ModifiedDateTime)
VALUES ("user5", "Dustin", "Henderson", 2, 1, "Gaten in Stranger Things", "2000-01-05", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


--CREATING UserPassword ENTITY

CREATE TABLE UserPassword (

    UserName VARCHAR(30) PRIMARY KEY NOT NULL,
    PasswordSalt VARCHAR(200) NOT NULL,
    Password VARCHAR(200) NOT NULL,
    AuthToken VARCHAR(200),
    ModifiedDateTime DATETIME,

FOREIGN KEY (UserName) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE

);

--CREATING user1's password. --Password is "12".


INSERT INTO UserPassword (UserName, PasswordSalt, Password, AuthToken, ModifiedDateTime)
VALUES ("user1", 10, "$2b$10$DgFwHsjcXgZW0dO49qWirO3hJOqdpR33spMi6QJXt05NUZIbt4SBu", "bdfc5559-a1cf-40d9-80c4-51acf8e9e39b", CURRENT_TIMESTAMP);
INSERT INTO UserPassword (UserName, PasswordSalt, Password, AuthToken, ModifiedDateTime)
VALUES ("user2", 10, "$2b$10$DgFwHsjcXgZW0dO49qWirO3hJOqdpR33spMi6QJXt05NUZIbt4SBu", "bdfc5559-a1cf-40d9-80c4-51acf8e9e39b", CURRENT_TIMESTAMP);
INSERT INTO UserPassword (UserName, PasswordSalt, Password, AuthToken, ModifiedDateTime)
VALUES ("user3", 10, "$2b$10$DgFwHsjcXgZW0dO49qWirO3hJOqdpR33spMi6QJXt05NUZIbt4SBu", "bdfc5559-a1cf-40d9-80c4-51acf8e9e39b", CURRENT_TIMESTAMP);
INSERT INTO UserPassword (UserName, PasswordSalt, Password, AuthToken, ModifiedDateTime)
VALUES ("user4", 10, "$2b$10$DgFwHsjcXgZW0dO49qWirO3hJOqdpR33spMi6QJXt05NUZIbt4SBu", "bdfc5559-a1cf-40d9-80c4-51acf8e9e39b", CURRENT_TIMESTAMP);
INSERT INTO UserPassword (UserName, PasswordSalt, Password, AuthToken, ModifiedDateTime)
VALUES ("user5", 10, "$2b$10$DgFwHsjcXgZW0dO49qWirO3hJOqdpR33spMi6QJXt05NUZIbt4SBu", "bdfc5559-a1cf-40d9-80c4-51acf8e9e39b", CURRENT_TIMESTAMP);







--CREATING Article ENTITY

CREATE TABLE Article (
	ArticleID INTEGER PRIMARY KEY NOT NULL,
    ArticleTitle VARCHAR(50) NOT NULL,
	ArticleCreator VARCHAR(30) NOT NULL,
	ArticleContent TEXT NOT NULL,
    ArticleImagePath TEXT,
	CreatedDateTime DATETIME NOT NULL,
	ModifiedDateTime DATETIME,
	FOREIGN KEY (ArticleCreator) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE
	
);



--Inserting dummy articles


INSERT INTO Article (ArticleTitle, ArticleCreator, ArticleContent, ArticleImagePath, CreatedDateTime, ModifiedDateTime)
VALUES ("My First Article", "user1", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s","images/coverImages/defaultCover.jpg", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO Article (ArticleTitle, ArticleCreator, ArticleContent, ArticleImagePath, CreatedDateTime, ModifiedDateTime)
VALUES ("My Second Article", "user1", "When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.","images/coverImages/defaultCover.jpg", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO Article (ArticleTitle, ArticleCreator, ArticleContent, ArticleImagePath, CreatedDateTime, ModifiedDateTime)
VALUES ("My Third Article", "user1", "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","images/coverImages/defaultCover.jpg", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO Article (ArticleTitle, ArticleCreator, ArticleContent, ArticleImagePath, CreatedDateTime, ModifiedDateTime)
VALUES ("My Fourth Article", "user1", "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.", "images/coverImages/defaultCover.jpg", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);




--CREATING ArticleLike ENTITY

CREATE TABLE ArticleLike (
		ArticleID INTEGER NOT NULL,
		LikedByID VARCHAR(30) NOT NULL,
		LikedDateTime DATETIME NOT NULL,
		CONSTRAINT PK_ArticleLike PRIMARY KEY (ArticleID, LikedByID),
		FOREIGN KEY (ArticleID) REFERENCES Article (ArticleID) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (LikedByID) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE
		
);



--CREATING ArticleComment ENTITY

CREATE TABLE ArticleComment (
	CommentID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	ArticleID INTEGER NOT NULL,
	CommentedByID VARCHAR(30) NOT NULL,
	CommentContext TEXT NOT NULL,
	ReplyToID INTEGER DEFAULT NULL,
	CreatedDateTime DATETIME NOT NULL,
	ModifiedDateTime DATETIME,
	FOREIGN KEY (ReplyToID) REFERENCES ArticleComment (CommentID) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (ArticleID) REFERENCES Article (ArticleID) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (CommentedByID) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE
	
);


--Creating Dummy Comments for "My First Article"

INSERT INTO ArticleComment (ArticleID, CommentedByID, CommentContext, ReplyToID, CreatedDateTime, ModifiedDateTime)
VALUES ("1", "user1", "This is my first comment.", NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO ArticleComment (ArticleID, CommentedByID, CommentContext, ReplyToID, CreatedDateTime, ModifiedDateTime)
VALUES ("1", "user1", "This is my first reply to first comment.", "1", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO ArticleComment (ArticleID, CommentedByID, CommentContext, ReplyToID, CreatedDateTime, ModifiedDateTime)
VALUES ("1", "user1", "This is my first reply to my first reply.", "2", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO ArticleComment (ArticleID, CommentedByID, CommentContext, ReplyToID, CreatedDateTime, ModifiedDateTime)
VALUES ("1", "user1", "This is my second comment.", NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);





--CREATING UserSubscription ENTITY

CREATE TABLE UserSubscription (
	UserName VARCHAR (30) NOT NULL,
	SubscribedTo VARCHAR(30) NOT NULL,
	SubscribedDateTime DATETIME DEFAULT CURRENT_TIMESTAMP ,
	CONSTRAINT PK_UserSubscription PRIMARY KEY (UserName, SubscribedTo),
	FOREIGN KEY (UserName) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (SubscribedTo) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE
	);




--CREATING NotificationType ENTITY

CREATE TABLE NotificationType (
NotificationTypeID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
NotificationDescription TEXT NOT NULL
);

--INSERTING INTO NotificationType ENTITY

INSERT INTO NotificationType(NotificationDescription)
VALUES ("New Article");

INSERT INTO NotificationType(NotificationDescription)
VALUES ("New Comment");

INSERT INTO NotificationType(NotificationDescription)
VALUES ("New Subscriber");






--CREATING UserNotification ENTITY 

CREATE TABLE UserNotification (
UserName VARCJAR (30) NOT NULL,
NotificationTypeID INTEGER NOT NULL,
NewArticleID INTEGER DEFAULT NULL,
NotificationFrom VARCHAR(30) NOT NULL,
NotificationMessage TEXT,
NotificationSentDateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
isNotificationSeen CHAR NOT NULL DEFAULT "F",
CONSTRAINT PK_UserNotification PRIMARY KEY (UserName, NotificationTypeID, NewArticleID,NotificationFrom, NotificationSentDateTime),
FOREIGN KEY (UserName) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (NotificationFrom) REFERENCES UserAccount (UserName) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (NotificationTypeID) REFERENCES NotificationType (NotificationTypeID) ON UPDATE CASCADE,
FOREIGN KEY (NewArticleID) REFERENCES Article (ArticleID) ON DELETE CASCADE ON UPDATE CASCADE
);