
export function deleteAccount() {
    // delete user account
    const deleteButton = document.querySelector('.delete-account');
    deleteButton && deleteButton.addEventListener('click', async function() {
        const modal = document.querySelector('#deleteAccountModal');
        modal.classList.add('show');
        modal.querySelector('.cancel').addEventListener('click', function() {
            modal.classList.remove('show');
        });
        modal.querySelector('.ok').addEventListener('click', async function() {
            let response = await fetch('/accountdelete', {
                method: 'POST'
            });
            response = await response.json();
            if (!response.errno) {
                location.href = '/login';
            }
        });
    });
}

export async function notificationHandler() {
    
    let response = await fetch('/notificationslist');
    
    try {
        const {notificationslist, total} = await response.json();
        const msgContainer = document.querySelector('.messages-container ul');
        if (notificationslist.length) {
            msgContainer.innerHTML = '';
        } else {
            msgContainer.innerHTML = '<li style="justify-content:center;">empty message.</li>';
            return;
        }
        const count = document.querySelector('.messages-count');

        if (total > 0) {
            count.innerHTML = total;
            count.classList.add('show');
        } else {
            count.classList.remove('show');
        }

        for (let i = 0; i < notificationslist.length; i++) {
            const notifcation = notificationslist[i];
            const {
                NotificationTypeID,
                NewArticleID,
                NotificationFrom,
                AvatarPath,
                NotificationMessage,
                NotificationSentDateTime,
                isNotificationSeen
            } = notifcation;
            
            let href = '';
            href = NewArticleID 
                ? `/viewarticle?articleID=${NewArticleID}` 
                : `/accountcenter?username=${NotificationFrom}`;

            msgContainer.innerHTML += `
            <li class="${isNotificationSeen === 'T' ? 'read' : ''}"
                notificationTypeID="${NotificationTypeID}"
                articleID="${NewArticleID}"
                notificationFrom="${NotificationFrom}">
                <a href="${href}">
                    <img src="${AvatarPath}">
                    <div>
                        ${isNotificationSeen === 'T' ? '<p>Been read</p>' : ''}
                        <p class="title">
                            ${NotificationMessage}
                        </p>
                        <p>
                            ${NotificationSentDateTime} ${NotificationFrom}
                        </p>
                    </div>
                </a>
            </li>`;
        }

        const list = msgContainer.querySelectorAll('li');

        for (let i = 0; i < list.length; i++) {
            
            const li = list[i];

            li.addEventListener('click', function() {
                const notificationTypeID = this.getAttribute('notificationTypeID');
                const articleID = this.getAttribute('articleID');
                const notificationFrom = this.getAttribute('notificationFrom');

                fetch('/changenotificationstatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `notificationTypeID=${notificationTypeID}&articleID=${articleID}&notificationFrom=${notificationFrom}`
                });
            });
        }
    } catch (error) {
        console.log('get notifications failed! need to login')
    }
}