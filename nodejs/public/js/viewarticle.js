/**
 * @file client side js when viewing article
 * @author Ting Wang
 */

 function showHideComments() {
    var x = document.getElementById("comment");
    var y = document.getElementById("show-comment");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.innerText = `	▼ Show less comments`;
    } else {
        x.style.display = "none";
        y.innerText = ` ▶ Show more comments`;
    }
}

buttonClicked = (event, articleID) => {
    var commentID = event.target.id.substring(event.target.id.lastIndexOf("-") + 1);
    var commentContent = document.getElementById(`commentID-${commentID}`);
    var outerDiv = document.getElementById(`outerDiv-${commentID}`);

    outerDiv.outerHTML = `
    <div id="outerDiv-${commentID}">
        <form action="/updateComment?articleID=${articleID}&commentID=${commentID}"
            method="post" onsubmit="" class="flex-row align-center justify-sb">
            <textarea type="textarea" 
                class="resize-none border-gray-300 rounded-md focus:border-gray-400 focus:ring-0 w-full" 
                id="commentContent" name="commentContent"
                style=min-height: 70px;max-height: 240px;">${commentContent.innerText}</textarea>
            <div class="flex">
                <input type="submit" name="done" value="DONE" 
                    class="basic-btn text-xs w-8 h-8 flex justify-center bg-teal-500" />
                <button class="basic-btn text-xs w-8 h-8 flex justify-center ml-3 bg-gray-400" 
                    onClick="cancelbuttonClicked()"
                    id="cancelButton-${commentID}">
                    CANCEL
                </button>
            </div>
        </form>
    </div>
    `;

    cancelbuttonClicked = () => {
        var outerDiv = document.getElementById(`outerDiv-${commentID}`);

        outerDiv.outerHTML = `
        <div class="flex" id="outerDiv-${commentID}">
            <blockquote class="" id="commentID-${commentID}">
            ${commentContent.innerText}
            </blockquote>
            <div class="flex-col" id="innerDiv-${commentID}">
                <button class="button button-3d button-mini center" onClick="buttonClicked(event, ${articleID})"
                    id="editButton-${commentID}">Edit</button>
                <form action="/deleteComment?articleID=${articleID}&commentID=${commentID}"
                    method="post" onsubmit="return confirm('Are you sure to delete this comment?');">
                    <input type="submit" name="delete" value="Delete"
                        class="button button-3d button-mini button-red" />
                </form>
        </div>
        `;
    }
}