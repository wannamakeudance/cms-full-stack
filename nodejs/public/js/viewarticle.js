/**
 * @file client side js when viewing article
 * @author Ting Wang
 */


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