/**
 * @file client side js when viewing article
 * @author Ting Wang
 */

 window.addEventListener('load', function() {

    // show or hide comments list
    const showMoreBtn = document.querySelector('#show-comment');
    const list = document.querySelector('.comments-list');
    showMoreBtn.onclick = function() {
        if (list.classList.contains('hidden')) {
            list.classList.remove('hidden');
        } else {
            list.classList.add('hidden');
        }
    };

    // show or hide reply inputs
    const replys = document.querySelectorAll('.reply-button');
    for(let i = 0; i < replys.length; i++) {
        replys[i].onclick = function() {
            const root = this.parentElement.parentElement.parentElement;
            const replyInput = root.querySelector('.reply-comment');
            if (replyInput.classList.contains('hidden')) {
                replyInput.classList.remove('hidden');
                replyInput.classList.add('flex');
            } else {
                replyInput.classList.add('hidden');
                replyInput.classList.remove('flex');
            }
        };
    }

    const toSeeMore = document.querySelectorAll('.more-replies-button');
     for(let i = 0; i < toSeeMore.length; i++) {
        toSeeMore[i].onclick = function() {
            const root = this.parentElement.parentElement.parentElement;
            const replyList = root.nextElementSibling;
            if (replyList.classList.contains('hidden')) {
                replyList.classList.remove('hidden');
            } else {
                replyList.classList.add('hidden');
            }
        };
    }
});
buttonClicked = (event, articleID) => {
    const commentID = event.target.id.substring(event.target.id.lastIndexOf("-") + 1);
    const outerDiv = document.getElementById(`outerDiv-${commentID}`);
    let initialOuter = outerDiv.outerHTML;
    const commentContent = document.querySelector(`#commentID-${commentID} span`);
    
    outerDiv.outerHTML = `
    <div id="outerDiv-${commentID}">
        <form action="/updateComment?articleID=${articleID}&commentID=${commentID}"
            method="post" onsubmit="" class="pb-4 mt-4 mr-8">
            <textarea type="textarea" 
                class="resize-none border-gray-300 rounded-md focus:border-gray-400 focus:ring-0 w-full mb-2" 
                id="commentContent" 
                name="commentContent"
                style=min-height: 70px;max-height: 200px;">${commentContent.innerText}</textarea>
            <div class="flex">
                <input type="submit" name="done" value="DONE" 
                    class="basic-btn text-xs w-8 h-8 flex justify-center bg-teal-500" />
                <input id="cancel" type="button"
                    class="basic-btn text-xs w-8 h-8 flex justify-center bg-gray-500 ml-6"
                    value="CANCEL"/>
            </div>
        </form>
    </div>
    `;

    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', function() {
        const outerDiv = document.getElementById(`outerDiv-${commentID}`);
        outerDiv.outerHTML = initialOuter;
    })
}