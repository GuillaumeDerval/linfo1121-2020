let socket = io();

socket.on("unauthenticated", content => {
    alert('Vous n\'êtes plus connecté. La page va se rafraîchir.');
    location.reload();
});

const avatarPublishedPresentation = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjNTc5RkZCIiBkPSJNMjc3LjMzIDM4NGEyMS4zMyAyMS4zMyAwIDExLTQyLjY2IDAgMjEuMzMgMjEuMzMgMCAwMTQyLjY2IDB6bTAgMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIvPjxwYXRoIGZpbGw9IiM1NzlGRkIiIGQ9Ik0yNTYgNTEyQzExNC44NCA1MTIgMCAzOTcuMTYgMCAyNTZTMTE0Ljg0IDAgMjU2IDBzMjU2IDExNC44NCAyNTYgMjU2LTExNC44NCAyNTYtMjU2IDI1NnptMC00ODBDMTMyLjQ4IDMyIDMyIDEzMi40OCAzMiAyNTZzMTAwLjQ4IDIyNCAyMjQgMjI0IDIyNC0xMDAuNDggMjI0LTIyNFMzNzkuNTIgMzIgMjU2IDMyem0wIDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiLz48cGF0aCBmaWxsPSIjNTc5RkZCIiBkPSJNMjU2IDMxNC42N2ExNiAxNiAwIDAxLTE2LTE2di0yMS41NWE0OC4xIDQ4LjEgMCAwMTMyLjA0LTQ1LjI3YzI1LjUtOC45OCA0Mi42My0zNi4xNCA0Mi42My01NS44NSAwLTMyLjM2LTI2LjMtNTguNjctNTguNjctNTguNjdzLTU4LjY3IDI2LjMtNTguNjcgNTguNjdhMTYgMTYgMCAwMS0zMiAwYzAtNDkuOTggNDAuNjctOTAuNjcgOTAuNjctOTAuNjdzOTAuNjcgNDAuNjkgOTAuNjcgOTAuNjdjMCAzNS41OS0yOC4xIDczLjM3LTYzLjk4IDg2LjA0YTE2IDE2IDAgMDAtMTAuNjkgMTUuMXYyMS41M2ExNiAxNiAwIDAxLTE2IDE2em0wIDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiLz48L3N2Zz4=";
const avatarPublishedAll = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjNTc5RkZCIiBkPSJNMjc3LjMgMzg0YTIxLjMgMjEuMyAwIDExLTQyLjYgMCAyMS4zIDIxLjMgMCAwMTQyLjYgMHptMCAwTTI1NiAzMjBhMTYgMTYgMCAwMS0xNi0xNlYxMjIuN2ExNiAxNiAwIDAxMzIgMFYzMDRhMTYgMTYgMCAwMS0xNiAxNnptMCAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIi8+PHBhdGggZmlsbD0iIzU3OUZGQiIgZD0iTTI1NiA1MTJDMTE0LjggNTEyIDAgMzk3LjIgMCAyNTZTMTE0LjggMCAyNTYgMHMyNTYgMTE0LjggMjU2IDI1Ni0xMTQuOCAyNTYtMjU2IDI1NnptMC00ODBDMTMyLjUgMzIgMzIgMTMyLjUgMzIgMjU2czEwMC41IDIyNCAyMjQgMjI0IDIyNC0xMDAuNSAyMjQtMjI0UzM3OS41IDMyIDI1NiAzMnptMCAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIi8+PC9zdmc+";
const avatarPublishedChat = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJDYWxxdWVfMSIgeD0iMCIgeT0iMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGRlZnMvPjxzdHlsZT4uc3Qwe2ZpbGw6IzU3OWZmYn08L3N0eWxlPjxwYXRoIGQ9Ik0yNTYgNTEyQzExNC44IDUxMiAwIDM5Ny4yIDAgMjU2UzExNC44IDAgMjU2IDBzMjU2IDExNC44IDI1NiAyNTYtMTE0LjggMjU2LTI1NiAyNTZ6bTAtNDgwQzEzMi41IDMyIDMyIDEzMi41IDMyIDI1NnMxMDAuNSAyMjQgMjI0IDIyNCAyMjQtMTAwLjUgMjI0LTIyNFMzNzkuNSAzMiAyNTYgMzJ6IiBjbGFzcz0ic3QwIi8+PHBhdGggZD0iTTM3MS41IDIzMy43YzAtNzAuMS03My44LTExNi0xNDcuNi0xMTYtNzQgMC0xNDcuNiA0Ni4xLTE0Ny42IDExNiAwIDI2LjQgMTEuNiA1Mi4zIDMyLjYgNzIuNy44LjggMS4xIDIgLjggMy4xLTYuNiAyNC4yLTIyLjIgNDYtMjguNiA1NC4zYTguMyA4LjMgMCAwMDYuNSAxMy41aC4yYzMxLjQtLjggNjcuOC05LjYgOTAuMy0zMS43YTMgMyAwIDAxMy0uOCAxODQgMTg0IDAgMDA0Mi43IDQuOWM3NC4xIDAgMTQ3LjctNDYuMSAxNDcuNy0xMTZ6TTE4My43IDMzMy44Yy00LjktMS4yLTkuOS4yLTEzLjUgMy43LTIyLjUgMjIuMS01OS4yIDI3LjEtNzYuNiAyOC4zIDcuOS0xMSAyMC45LTMxLjEgMjYuOS01My4zIDEuNC01LjEtLjEtMTAuNS0zLjgtMTQuMWE4OS43IDg5LjcgMCAwMS0yOS4yLTY0LjdDODcuNiAxNzYgMTQ4LjcgMTI5IDIyMy45IDEyOXMxMzYuMyA0NyAxMzYuMyAxMDQuN1MyOTkgMzM4LjQgMjIzLjkgMzM4LjRjLTEzLjcgMC0yNy4yLTEuNS00MC4yLTQuNnoiIGNsYXNzPSJzdDAiLz48cGF0aCBkPSJNNDA3LjYgMzI3LjFjMzIuOC0xNi42IDUyLjMtNDQuOCA1Mi4zLTc1LjUgMC00My40LTM5LjItODAuNS05My4zLTg4LjJhNS43IDUuNyAwIDAwLTYuNCA0LjggNS43IDUuNyAwIDAwNC44IDYuNGM0OC41IDYuOSA4My42IDM5LjMgODMuNiA3Ny4xIDAgMjYuNC0xNy4zIDUwLjgtNDYuMiA2NS41YTEzLjkgMTMuOSAwIDAwLTcuMyAxNS4zYzIuNyAxMi45IDguNiAyNC44IDEzLjIgMzIuOS0zMy4yLTUuNS00NS44LTIxLjQtNDkuNy0yOC4zLTIuNS00LjMtNy02LjktMTItNi45aC0uNGMtNi4yIDAtMTIuNS0uNC0xOC41LTEuMy0zLjEtLjQtNS45IDEuNy02LjMgNC44czEuNyA1LjkgNC44IDYuM2M2LjYuOSAxMy40IDEuNCAyMC4xIDEuNGguNWMuOSAwIDEuOC41IDIuMyAxLjMgMTUuMiAyNi40IDUwLjIgMzMuMSA2NC41IDM0LjhhOCA4IDAgMDA3LjktMy44YzEuNy0yLjcgMS43LTYtLjEtOC43LTQuMy02LjctMTItMjAuMi0xNS4xLTM0LjgtLjMtMS40LjItMi42IDEuMy0zLjF6TTEzNi41IDIxMy42YTE5LjUgMTkuNSAwIDEwMCAzOSAxOS41IDE5LjUgMCAwMDAtMzl6bTAgMjcuN2E4LjIgOC4yIDAgMDEtOC4yLTguMmMwLTQuNSAzLjctOC4yIDguMi04LjJzOC4yIDMuNyA4LjIgOC4yYzAgNC41LTMuNyA4LjItOC4yIDguMnpNMTkyIDIxMy42YTE5LjUgMTkuNSAwIDEwMCAzOSAxOS41IDE5LjUgMCAwMDAtMzl6bTAgMjcuN2E4LjIgOC4yIDAgMDEtOC4yLTguMmMwLTQuNSAzLjctOC4yIDguMi04LjIgNC41IDAgOC4yIDMuNyA4LjIgOC4yYTguMSA4LjEgMCAwMS04LjIgOC4yek0yNDcuNiAyMTMuNmExOS41IDE5LjUgMCAxMDAgMzkgMTkuNSAxOS41IDAgMDAwLTM5em0wIDI3LjdhOC4yIDguMiAwIDAxLTguMi04LjJjMC00LjUgMy43LTguMiA4LjItOC4yIDQuNSAwIDguMiAzLjcgOC4yIDguMiAwIDQuNS0zLjcgOC4yLTguMiA4LjJ6TTMwMy4xIDIxMy42YTE5LjUgMTkuNSAwIDEwMCAzOSAxOS41IDE5LjUgMCAwMDAtMzl6bTAgMjcuN2E4LjIgOC4yIDAgMDEtOC4yLTguMmMwLTQuNSAzLjctOC4yIDguMi04LjIgNC41IDAgOC4yIDMuNyA4LjIgOC4yYTguMSA4LjEgMCAwMS04LjIgOC4yeiIgY2xhc3M9InN0MCIvPjwvc3ZnPg==";

socket.on('error', function (error) {
    if (error === "cookie")
        window.location.replace("/login");
    else
        alert("An error occured: " + error);
});



const tm = texmath.use(katex);
const md = markdownit().use(tm, { engine: katex,
    delimiters:'brackets'
});


function get(selector, root = document) {
    return root.querySelector(selector);
}

const msgerForm = get(".msger-inputarea");
const msgerPreview = get(".msger-preview");
const msgerInput = get(".msger-input");
const msgerSendButton = get(".msger-send-btn")
const msgerChat = get(".msger-chat");
let studentMessageAddNearElement = msgerChat;
let studentMessageAddWhere = "beforeend";

function updatePreview() {
    msgerPreview.innerHTML = md.render(msgerInput.value);
    if(msgerPreview.innerHTML.length > 100 || msgerPreview.innerHTML.includes("<eq>"))
        msgerPreview.style.display = 'block';
    else
        msgerPreview.style.display = 'none';
}

msgerInput.addEventListener("change", updatePreview);
msgerInput.addEventListener("keyup", updatePreview);
msgerInput.addEventListener("input", updatePreview);
msgerInput.addEventListener("paste", updatePreview);

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function moderate(status, id, publicationType=undefined) {
    let message = "";
    if(msgerInput.value !== "" && confirm("Mettre le message en commentaire?")) {
        message = msgerInput.value;
        msgerInput.value = "";
        updatePreview();
    }
    let msg = {"id": id, "comment": message};
    if(status !== undefined)
        msg["status"] = publicationType;
    modo.emit(status, msg);
}

function genCommentDiv(comment) {
    if(comment !== null)
        return `
            <div class="msg-text-comment-header">Commentaire du modérateur:</div>
            <div class="msg-text-comment-content">${comment}</div>
        `;
    return "";
}

function appendMessage(name, img, side, text, comment, id, status, showModerationButtons, where, wherePos) {
    const imgDiv = img != null ? `<div class="msg-img" style="background-image: url(&quot;${img}&quot;)"></div>` : "";
    let agreeDiv = "";
    if(side === "left")
        agreeDiv = `<button id="agree-${id}" class="msger-info-agree">👍</button>`;
    let moderationButtons = "";
    if(showModerationButtons)
        moderationButtons = `
            <div class="moderation-buttons">
                <button id="authorize-presentation-${id}" class="msger-modo-authorize-presentation">Validate - question</button>
                <button id="authorize-all-${id}" class="msger-modo-authorize-all">Validate - all</button>
                <button id="authorize-chat-${id}" class="msger-modo-authorize-chat">Validate - chat only</button>
                <button id="reject-${id}" class="msger-modo-reject">Reject</button>
            </div>
        `;

    let commentDiv = genCommentDiv(comment);

    const msgHTML = `
        <div class="msg ${side}-msg ${status}" id="message-${id}">
            ${imgDiv}

            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${formatDate(new Date())}</div>
                </div>

                <div class="msg-text">${text}</div>
                <div class="msg-text-comment">${commentDiv}</div>
                ${agreeDiv}
                ${moderationButtons}
            </div>
        </div>
    `;

    where.insertAdjacentHTML(wherePos, msgHTML);
    if(where === msgerChat && wherePos === "beforeend")
        msgerChat.scrollTop += 500;

    if(side === "left") {
        document.getElementById("agree-"+id).addEventListener("click", function() {
            socket.emit("agree", id);
        });
    }

    if(showModerationButtons) {
        document.getElementById("authorize-presentation-"+id).addEventListener("click", function() {
            moderate("authorize", id, "published-presentation");
        });
        document.getElementById("authorize-chat-"+id).addEventListener("click", function() {
            moderate("authorize", id, "published-chat");
        });
        document.getElementById("authorize-all-"+id).addEventListener("click", function() {
            moderate("authorize", id, "published-all");
        });
        document.getElementById("reject-"+id).addEventListener("click", function() {
            moderate("reject", id);
        });
    }
}

function updateAgreeSelf(id, selfAgree) {
    if(document.getElementById("agree-"+id) === null) {
        console.log("Received updateAgreeSelf for message "+ id + " but did not received this message yet.");
        return;
    }
    if(selfAgree)
        document.getElementById("agree-"+id).classList.add("selected");
    else
        document.getElementById("agree-"+id).classList.remove("selected");
}

function updateAgreeCount(id, nbAgree) {
    if(document.getElementById("agree-"+id) === null) {
        console.log("Received updateAgreeCount for message "+ id + " but did not received this message yet.");
        return;
    }
    document.getElementById("agree-"+id).innerText = `${nbAgree} 👍`;
}

function updateMessage(id, status, comment) {
    let elem = document.getElementById("message-"+id);
    elem.classList.remove("published-all");
    elem.classList.remove("published-presentation");
    elem.classList.remove("published-chat");
    elem.classList.remove("published");
    elem.classList.remove("rejected");
    elem.classList.remove("waiting");
    elem.classList.add(status);
    get(".msg-text-comment", elem).innerHTML = genCommentDiv(comment);
}

function receivedMessage(content, isModerator, whereElem, wherePos) {
    let message = document.getElementById("message-"+content["id"]);
    if(message === null) { //add it!
        let name = "";
        let image = null;
        let side = "left";
        let statusClass = content["status"];
        let showModerationButtons = false;

        if(content["author"] === "me") {
            name = "Moi";
            side = "right";
        }
        else if(content["author"] === "moderator") {
            name = "Modérateur";
            image = "https://image.flaticon.com/icons/svg/2991/2991206.svg";
        }
        else if(content["author"] === "student") {
            name = "Etudiant";
            if(content["status"] == "published-presentation")
                image = avatarPublishedPresentation;
            else if(content["status"] == "published-all")
                image = avatarPublishedAll;
            else
                image = avatarPublishedChat;
        }
        else if (isModerator) {
            name = content["author"];
            image = avatarPublishedPresentation;
            side = "right";
            showModerationButtons = true;
            statusClass = "";
        }
        else {
            console.log("Not moderator, but received message with author " + content["author"]);
            return;
        }

        appendMessage(name, image, side,
            md.render(content["content"]),
            "comment" in content ? md.render(content["comment"]) : null,
            content["id"],
            statusClass,
            showModerationButtons,
            whereElem, wherePos);

        if(side === "left") {
            if ("nbAgree" in content)
                updateAgreeCount(content["id"], content["nbAgree"]);
            if ("selfAgree" in content)
                updateAgreeSelf(content["id"], content["selfAgree"]);
            if (!("selfAgree" in content) || !("nbAgree" in content))
                socket.emit("please update count", content["id"]);
        }
    }
    else {
        updateMessage(content["id"], content["status"], "comment" in content ? md.render(content["comment"]) : null);
    }
}

socket.on('update message', content => {
    receivedMessage(content, false, studentMessageAddNearElement, studentMessageAddWhere);
});

socket.on('update count', content => {
    if("selfAgree" in content)
        updateAgreeSelf(content["id"], content["selfAgree"]);
    updateAgreeCount(content["id"], content["nbAgree"]);
});

function submitStudentMessage(type) {
    const msgText = msgerInput.value;
    if (!msgText)
        return;

    let msg = {"content": msgText};
    if(type !== undefined)
        msg["type"] = type;
    socket.emit('student message', msg);
    msgerInput.value = "";
    updatePreview();
}

/*

 */
Velocity("registerEasing", "gravity", function(percentComplete, startValue, endValue, property) {
	let p = percentComplete;
	return 4*(p-p*p)*(endValue-startValue) + startValue;
});

function sendReaction(reaction) {
    var div = document.createElement('div');
    div.innerHTML=reaction;
    div.style.fontSize="1.8em";
    div.style.position="absolute";
    div.style.bottom="-50px";
    div.style.left="50%";

    let force = Math.random()*0.3+0.7;
    let angle = (Math.random()*80.0-40.0)* (Math.PI/180.0);

    let height = document.body.clientHeight*0.5*Math.cos(angle);
    let width = document.body.clientHeight*0.5*Math.sin(angle);

    let fixed = document.getElementById("reaction-container");
    fixed.insertBefore(div, fixed.firstChild);

    div.velocity({
        properties: { bottom: height },
        options: { duration: 3000, easing: "gravity" }
    }).velocity({
        properties: { left: "+="+width+"px" },
        options: { duration: 3000, queue: false, easing: "linear" }
    });

    socket.emit('reaction', reaction);
}