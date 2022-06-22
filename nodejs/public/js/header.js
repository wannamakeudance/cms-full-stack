
window.addEventListener('load', async function() {
    deleteAccount();
    await notificationHandler();
});

function deleteAccount() {
    // delete user account
    const deleteButton = document.querySelector('.delete-account');
    deleteButton && deleteButton.addEventListener('click', async function() {
        const modal = document.querySelector('#deleteAccountModal');
        modal.classList.remove('hidden');
        modal.querySelector('.cancel').addEventListener('click', function() {
            modal.classList.add('hidden');
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

async function notificationHandler() {
    
    let response = await fetch('/notificationslist');
    
    try {
        const {notificationslist, total} = await response.json();
        const msgContainer = document.querySelector('.messages-container ul');
        if (notificationslist.length) {
            msgContainer.innerHTML = '';
        } else {
            msgContainer.innerHTML = '<li class="text-center w-36 p-2">empty message.</li>';
            return;
        }
        const count = document.querySelector('.messages-count');

        if (total > 0) {
            count.innerHTML = total;
            count.classList.remove('hidden');
        } else {
            count.classList.add('hidden');
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
            <li class="${isNotificationSeen === 'T' ? 'bg-gray-100' : ''}"
                notificationTypeID="${NotificationTypeID}"
                articleID="${NewArticleID}"
                notificationFrom="${NotificationFrom}">
                <a href="${href}" class="border-b-2 flex p-4 hover:bg-gray-200 items-center">
                    <img src="${AvatarPath}" class="w-20 h-16 mr-10">
                    <div class="w-60">
                        ${isNotificationSeen === 'T' ? '<p class="text-xs text-gray-500">Been read</p>' : ''}
                        <p class="text-sm font-medium">
                            ${NotificationMessage}
                        </p>
                        <p class="text-xs text-zinc-700 mt-2 align-middle">
                            ${NotificationSentDateTime} <span class="text-zinc-500 text-sm ml-2 font-bold">${NotificationFrom}</span>
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