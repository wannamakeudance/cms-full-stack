/**
 * @file the articles handlers(includes filter/ like or unlike)
 * @author xiangzheng Jing
 */

 export function articlesFilter() {

    const filter = document.querySelector('.articles-filter');
    if (!filter) return;

    filter.querySelectorAll('button').forEach(btn => {

        // when you click different button, there will have effects below:
        btn.addEventListener('click', async function () {
            
            // 1. the current button will show chosen status
            filter.querySelectorAll('button').forEach(ele =>{
               ele.classList.remove('sort-selected');
            });

            this.classList.add('sort-selected');

            
            // 2. the brower will send different request.
            let query = `type=${this.id}`;        
            if (location.pathname === '/accountcenter') {
                query += '&isMyArticles=true';
            }
            if (location.search.indexOf('username=') !== -1) {
                query += `&userName=${location.search.split('=')[1]}`;
            }

            let res = await fetch(`/filter?${query}`);
            res = await res.json();

            // 3. the container will render different content by response.
            const container = document.querySelector('#artiles-list');
            container.innerHTML = '';
            for(let i = 0; i < res.data.length; i++) {
                const item = res.data[i];
                container.innerHTML += `
                <div class="card align-center article-list">
                    <a href="/viewarticle?articleID=${item.ArticleID}" class="cover-container">
                        <img src="${item.ArticleImagePath}" class="cover-thumb max-w-xs h-36 mr-10" alt="cover">
                    </a>
                    <div class="article-main">
                        <div class="flex items-center">
                            <button id="like" class="like-button text-red-500 text-3xl hover:opacity-80"  articleid="${item.ArticleID}">
                                ${item.isLiked? "♥" : "♡"}
                            </button>
                            <p id="like-count" class="like-count text-base text-gray-500 ml-1">
                                ${item.TotalLikes}
                            </p>
                            <a href="/viewarticle?articleID=${item.ArticleID}" class="article-title text-xl font-semibold ml-6 hover:opacity-60">
                                ${item.ArticleTitle}
                            </a>
                        </div>
                        <div class="flex mt-1 text-gray-400  article-info">
                            <p>${item.CreatedDateTime}</p>
                                    ｜
                                    
                            <p><a href="/accountcenter?username=${item.ArticleCreator}" class="article-info hover:text-gray-800">${item.ArticleCreator}</a></p>
                        </div>
                        <p class="mt-5 text-zinc-400">
                            ${item.ArticleContent}
                            <a href="/viewarticle?articleID=${item.ArticleID}" class="read-more text-gray-500 hover:text-gray-800">
                                Read more
                            </a>
                        </p>
                    </div>
                </div>
                `;
            }
            likeArtileHandler();
        });
    })
};

export function likeArtileHandler() {
    let likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function () {          
            if (this.innerText === '♡') {
                handleLikeWithCount({
                    type: 'like',
                    btn
                });
            } else  {
                handleLikeWithCount({
                    type: 'unlike',
                    btn
                });
            }
        })
    });

    /**
     * handle the unlike or like features
     * 
     * @param {string} type like/unlike
     * @param {object} btn the like element
     * @returns null
     */
    async function handleLikeWithCount({
        type,
        btn
    }) {
        let count = btn.nextElementSibling;
        const username = document.querySelector('#hidden-username').value;
        const articleID = btn.getAttribute('articleid');
        const countNumber = Number(count.innerText);
        if (countNumber === 0 && type === 'unlike') return;

        let res = await fetch(`/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${username}&articleID=${articleID}`
        });
        res = await res.json();
        if (res.errno === 304) {
            location.href = '/login';
        } else if (res.errno === 0) {
            if (type === 'like') {
                btn.innerText = `♥`;
                count.innerText = countNumber + 1;
            } else {
                btn.innerText = '♡';
                count.innerText = countNumber - 1;
            }
        }
    }
}