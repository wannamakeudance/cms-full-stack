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
            <textarea type="textarea" class="form-control reply-text" id="commentContent" name="commentContent"
                style="resize: none;min-height: 70px;max-height: 240px;">${commentContent.innerText}</textarea>
            <div class="flex-col">
                <input type="submit" name="done" value="done" class="button button-3d button-mini center done-button" />
                <button class="button button-3d button-mini center button-light button-red" onClick="cancelbuttonClicked()"
                    id="cancelButton-${commentID}">Cancel</button>
            </div>
        </form>
    </div>
    `;

    cancelbuttonClicked = () => {
        var outerDiv = document.getElementById(`outerDiv-${commentID}`);

        outerDiv.outerHTML = `
        <div class="flex-row align-center justify-sb" id="outerDiv-${commentID}">
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