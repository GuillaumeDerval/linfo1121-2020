function initChatAndVote() {
    document.getElementById("chat").classList.remove("chat-hidden");

    const tm = texmath.use(katex);
    const md = markdownit().use(tm, {
        engine: katex,
        delimiters: 'brackets'
    });

    Velocity("registerEasing", "gravity", function (percentComplete, startValue, endValue, property) {
        let p = percentComplete;
        return 4 * (p - p * p) * (endValue - startValue) + startValue;
    });

    function showReaction(reaction) {
        var div = document.createElement('div');
        div.innerHTML = reaction;
        div.style.fontSize = "1.8em";
        div.style.position = "absolute";
        div.style.bottom = "-50px";
        div.style.left = "50%";

        let force = Math.random() * 0.3 + 0.7;
        let angle = (Math.random() * 80.0 - 40.0) * (Math.PI / 180.0);

        let height = document.body.clientHeight * 0.4 * Math.cos(angle);
        let width = document.body.clientHeight * 0.4 * Math.sin(angle);

        let fixed = document.getElementById("reaction-container");
        fixed.insertBefore(div, fixed.firstChild);

        div.velocity({
            properties: {bottom: height},
            options: {duration: 3000, easing: "gravity"}
        }).velocity({
            properties: {left: "+=" + width + "px"},
            options: {duration: 3000, queue: false, easing: "linear"}
        });
    }

    function genCommentDiv(comment) {
        if (comment !== null && comment !== undefined)
            return `
                <div class="message-comment-header">Commentaire du modérateur:</div>
                <div class="message-comment-content">${md.render(comment)}</div>
            `;
        return "";
    }

    function appendMessage(id, status, name, text, comment, nbAgree=0) {
        let commentDiv = genCommentDiv(comment);

        var div = document.createElement('div');
        div.innerHTML = `
            <div class="message-header">
                <div class="message-author">${name}</div>
                <div class="message-agree" id="agree-${id}">${nbAgree} 👍</div>
            </div>
            <div class="message-content">${text}</div>
            <div class="message-comment">${commentDiv}</div>
        `;
        div.id = `message-${id}`;
        div.style.height = "0px";
        div.style.marginBottom = "0px";
        div.style.paddingTop = "0px";
        div.style.paddingBottom = "0px";
        div.classList = `message ${status}`;

        let parent = document.getElementById("chat");
        parent.insertBefore(div, parent.firstChild.nextSibling);

        let elem = document.getElementById(`message-${id}`);
        appearAndSlide(elem);

        elem.addEventListener("dblclick", function () {
            slideAndRemove(elem);
        });
    }

    // Modified from https://css-tricks.com/using-css-transitions-auto-dimensions/
    function slideAndRemove(element) {
        // get the height of the element's inner content, regardless of its actual size
        var sectionHeight = element.scrollHeight;

        // temporarily disable all css transitions
        var elementTransition = element.style.transition;
        element.style.transition = '';

        // on the next frame (as soon as the previous style change has taken effect),
        // explicitly set the element's height to its current pixel height, so we
        // aren't transitioning out of 'auto'
        requestAnimationFrame(function () {
            element.style.height = sectionHeight + 'px';
            element.style.transition = elementTransition;

            // on the next frame (as soon as the previous style change has taken effect),
            // have the element transition to height: 0
            requestAnimationFrame(function () {
                element.style.height = 0 + 'px';
                element.style.marginTop = 0 + 'px';
                element.style.marginBottom = 0 + 'px';
                element.style.paddingTop = 0 + 'px';
                element.style.paddingBottom = 0 + 'px';
            });
        });

        element.addEventListener('transitionend', function (e) {
            // remove this event listener so it only gets triggered once
            element.removeEventListener('transitionend', arguments.callee);
            element.parentNode.removeChild(element);
        });
    }

    function appearAndSlide(element) {
        const sectionHeight = element.scrollHeight + 10;

        requestAnimationFrame(function () {
            // when the next css transition finishes (which should be the one we just triggered)
            element.addEventListener('transitionend', function (e) {
                // remove this event listener so it only gets triggered once
                element.removeEventListener('transitionend', arguments.callee);

                // remove "height" from the element's inline styles, so it can return to its initial value
                element.style.height = null;
                element.style.marginTop = null;
                element.style.marginBottom = null;
                element.style.paddingTop = null;
                element.style.paddingBottom = null;
            });

            // have the element transition to the height of its inner content
            element.style.height = sectionHeight + 'px';
            element.style.marginBottom = "10px";
            element.style.paddingTop = "5px";
            element.style.paddingBottom = "5px";
        });
    }

    var socket = io();
    var presentation = io.connect('/presentation');
    presentation.on("reaction", data => {
        showReaction(data['content']);
    });
    socket.on("update message", data => {
        if (data["status"] !== "published-all" && data["status"] !== "published-presentation")
            return;
        if (document.getElementById("message-" + data["id"]) !== null) {
            let elem = document.getElementById("message-" + data["id"]);
            elem.parentNode.removeChild(elem);
        }

        appendMessage(data["id"], data["status"],
            data["author"] == "moderator" ? "Modérateur" : "Etudiant",
            md.render(data["content"]), data["comment"], data["nbAgree"]);
    });
    socket.on("update count", data => {
        let id = data["id"];
        let count = data["nbAgree"];
        if (document.getElementById("agree-" + id) === null) {
            console.log("Received updateAgreeCount for message " + id + " but did not received this message yet.");
            return;
        }
        document.getElementById("agree-" + id).innerText = `${count} 👍`;
    });

    let currentlyVoting = false;
    let shouldHideReactions = false;
    let currentVotingReaction = {};
    let currentVote = null;
    let currentVoteDesc = null;

    function initVote() {
        if(Reveal.getCurrentSlide().getElementsByClassName("vote").length == 0) {
            currentlyVoting = false;
            shouldHideReactions = false;
            currentVotingReaction = {};
            currentVote = null;
            currentVoteDesc = null;
            return;
        }
        currentVote = Reveal.getCurrentSlide().getElementsByClassName("vote")[0];


        let reactions = Array.from(Reveal.getCurrentSlide().getElementsByClassName("vote")[0].getElementsByTagName("dt")).map(x => x.innerHTML);
    }
}