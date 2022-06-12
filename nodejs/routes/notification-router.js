/**
 *@file the apis about notifications 
 *
 */
const express = require('express');
const router = express.Router();
const mainNotificationDao = require('../modules/notification-dao/mainNotification-dao');

/**
 * get the notifications for the current user
 */
router.get('/notificationslist', async function(req, res) {
    try {
        const username = req.session.username;
        const notificationslist = await mainNotificationDao.getAllNotificationByUsername(username);
        const totalInfo = await mainNotificationDao.getTotalUnseenNotificationByUserName(username);
        res.json({
            errno: 0,
            notificationslist,
            total: totalInfo[0].UnseenNotification
        });
    } catch (error) {
        res.json({
            errno: 500,
            message: JSON.stringify(error)
        });
    }
 });
 
/**
 * change the status of notification to read
 */
 router.post('/changenotificationstatus', async function(req, res) {
     try {
        const username = req.session.username;
        let {
            notificationTypeID,
            articleID,
            notificationFrom
        } = req.body;
        
        notificationTypeID = Number(notificationTypeID);
        articleID = Number(articleID);
        articleID = isNaN(articleID) ? "null" : articleID;
        await mainNotificationDao.changeNotificationStatus(username, notificationTypeID, articleID, notificationFrom);
        res.json({
            errno: 0,
            message: 'success!'
        })
     } catch (error) {
         res.json({
             errno: 500,
             message: JSON.stringify(error)
         });
     }
 });


 module.exports = router;