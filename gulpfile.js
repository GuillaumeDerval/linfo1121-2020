const yargs = require('yargs')
const gulp = require('gulp')
const gulpBabel = require('gulp-babel');
const gulpSourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass')
const minify = require('gulp-clean-css')
const connect = require('gulp-connect')
const crypto = require('crypto');
const uniqid = require('uniqid');
const Cookies = require('cookies');
const bodyParser = require('body-parser');
const saml2 = require('saml2-js');
const fs = require('fs');
const socketio = require('socket.io');

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000

// Prevents warnings from opening too many test pages
process.setMaxListeners(20);

gulp.task('chat-js', () => {
    return gulp.src('js/chat.js')
        .pipe(gulpSourcemaps.init())
		.pipe(gulpBabel({
			presets: ['@babel/preset-env'],
            minified: true
		}))
        .pipe(gulpSourcemaps.write("."))
		.pipe(gulp.dest('dist'));
});

gulp.task('chat-slide-js', () => {
    return gulp.src('js/chat_slide.js')
        .pipe(gulpSourcemaps.init())
		.pipe(gulpBabel({
			presets: ['@babel/preset-env'],
            minified: true
		}))
        .pipe(gulpSourcemaps.write("."))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', gulp.parallel('chat-js', 'chat-slide-js'));

gulp.task('css-chat', () => gulp.src(['css/chat.scss'])
    .pipe(sass())
    .pipe(minify({compatibility: 'ie9'}))
    .pipe(gulp.dest('./dist')))

gulp.task('css-chat-slide', () => gulp.src(['css/chat_slide.scss'])
    .pipe(sass())
    .pipe(minify({compatibility: 'ie9'}))
    .pipe(gulp.dest('./dist')))

gulp.task('css', gulp.parallel('css-chat', 'css-chat-slide'))

gulp.task('build', gulp.parallel('js', 'css'))
gulp.task('default', gulp.series('build'))

gulp.task('reload', () => gulp.src(['*.html', '*.md'])
    .pipe(connect.reload()));


// Create service provider
var sp_options = {
  entity_id: "https://lsinf1121.info.ucl.ac.be/metadata.xml",
  private_key: fs.readFileSync("saml/server.key").toString(),
  certificate: fs.readFileSync("saml/server.crt").toString(),
  assert_endpoint: "http://0.0.0.0:8000/login-callback"
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
  sso_login_url: "https://samltest.id/idp/profile/SAML2/Redirect/SSO",
  sso_logout_url: "https://samltest.id/idp/profile/SAML2/Redirect/SLO",
  certificates: [
      fs.readFileSync("saml/idpCert1.crt").toString(),
      fs.readFileSync("saml/idpCert2.crt").toString(),
      fs.readFileSync("saml/idpCert3.crt").toString()
  ]
};
var idp = new saml2.IdentityProvider(idp_options);

function getCookies(req, res = undefined) {
    if(res === undefined)
        res = {getHeader: () =>{}, setHeader: () => {}};
    return new Cookies(req, res, { keys: ["TODO-CHANGE-MEEEEEE"] });
}

function checkModo(name, email) {
    return email === "msmith@samltest.id";
}

function sendMessage(message, socket, userMail = null, displayAuthor = false) {
    let author = "";
    if(message["author"] === "STUDENT")
        author = "student";
    else if(message["author"] === "MODERATOR")
        author = "moderator";
    else if(displayAuthor)
        author = message["author"];
    else //the only case here is when we send a student its own message
        author = "me";

    let msg = {
        "author": author,
        "status": message["status"],
        "content": message["content"],
        "id": message["id"],
        'time': message["time"],
        "nbAgree": message["reactionAgree"].size
    };

    if(userMail !== null)
        msg["selfAgree"] = message["reactionAgree"].has(userMail);

    if("comment" in message)
        msg["comment"] = message["comment"];

    console.log(msg);
    socket.emit("update message", msg);
}

function sendUpdateCount(message, socket, userMail = null) {
    let msg = {
        "id": message["id"],
        'nbAgree': message["reactionAgree"].size
    };
    if(userMail !== null)
        msg["selfAgree"] = message["reactionAgree"].has(userMail);
    socket.emit("update count", msg);
}

function protect(name, f) {
    return function() {
        try {
            f.apply(null, arguments);
        }
        catch (e) {
            console.log("Error in " + name);
            console.log(e);
        }
    }
}

function isPublishedStatus(status) {
    return status === "published-all" || status === "published-chat" || status === "published-presentation";
}

function manage_io(server) {
    const io = socketio(server);
    const modo = io.of("/modo");
    const presentation = io.of("/presentation");
    let messages = {};

    modo.use((socket, next) => {
        var cookies = getCookies(socket.handshake);
        var userName = cookies.get('userName', { signed: true });
        var userMail = cookies.get('userMail', { signed: true });
        if(!checkModo(userName, userMail)) {
            console.log("Invalid username");
            return next(new Error('authentication error'));
        }
        console.log("Valid username");
        return next();
    });

    modo.on('connection', (socket) => {
        console.log("Modo connected");

        let tmpAry = [];
        for(let x in messages)
            if(messages[x]["status"] === "waiting")
                tmpAry.push(x);
        tmpAry.sort((a,b) => {return messages[a]["time"] - messages[b]["time"];});
        for(let x in tmpAry)
            sendMessage(messages[tmpAry[x]], socket, "MODERATOR", true);

        socket.on('authorize', protect("MODO_AUTHORIZE", data => {
            let id = data["id"];
            let comment = data["comment"];
            let status = data["status"];
            if(!isPublishedStatus(status)) {
                console.log("Invalid status sent by moderator: " + status);
                return;
            }

            if (!(id in messages) || messages[id]["status"] !== "waiting")
                return;
            messages[id]["status"] = "published";
            if (comment !== null && comment !== "")
                messages[id]["comment"] = comment;
            sendMessage(messages[id], io.to("user-" + messages[id]["author"]), messages[id]["author"]);
            modo.emit("moderated", id);

            let id2 = uniqid();
            messages[id2] = {
                "author": "STUDENT",
                "id": id2,
                "content": messages[id]["content"],
                "status": status,
                "time": Date.now(),
                "reactionAgree": new Set(),
            };
            if ("comment" in messages[id])
                messages[id2]["comment"] = comment;

            sendMessage(messages[id2], io, "NEW");
        }));

        socket.on('reject', protect("MODO_REJECT", data => {
            let id = data["id"];
            let comment = data["comment"];

            if(!(id in messages) || messages[id]["status"] !== "waiting")
                return;
            messages[id]["status"] = "rejected";
            if(comment !== null && comment !== "")
                messages[id]["comment"] = comment;
            sendMessage(messages[id], io.to("user-"+messages[id]["author"]), messages[id]["author"]);
            modo.emit("moderated", id);
        }));
    });

    io.on('connection', (socket) => {
        const cookies = getCookies(socket.handshake);
        const userName = cookies.get('userName', {signed: true});
        const userMail = cookies.get('userMail', {signed: true});
        if(userName !== undefined && userMail !== undefined) {
            let userHash = crypto.createHash('md5').update(userName).update(userMail).digest('hex');

            //authenticated user
            const roomName = "user-"+userMail;
            socket.join(roomName);

            console.log("New connection " + userName + " " + userMail);

            socket.on('student message', protect("STUDENT_MESSAGE", (message) => {
                console.log("Message: "+message);
                let isModo = checkModo(userName, userMail);
                let status = "waiting";
                if(isModo) {
                    if("type" in message && message["type"] == "published-chat")
                        status = "published-chat";
                    else if("type" in message && message["type"] == "published-presentation")
                        status = "published-presentation";
                    else
                        status = "published-all";
                }

                let id = uniqid();
                messages[id] = {
                    "author": isModo ? "MODERATOR" : userMail,
                    "id": id,
                    "content": message["content"],
                    "status": status,
                    "time": Date.now(),
                    "reactionAgree": new Set()
                };

                if(!isModo) {
                    sendMessage(messages[id], io.to(roomName), userMail);
                    sendMessage(messages[id], modo, "MODERATOR", true);
                }
                else {
                    console.log("New modo message");
                    sendMessage(messages[id], io, "NEW");
                }
            }));

            socket.on('please update count', protect("UPDATE_STATUS_COUNT", (id) => {
                if(id in messages && isPublishedStatus(messages[id]["status"])) {
                    sendUpdateCount(messages[id], socket, userMail);
                }
            }));

            socket.on('agree', protect("AGREE", (id) => {
                if(id in messages && isPublishedStatus(messages[id]["status"])) {
                    if(messages[id]["reactionAgree"].has(userMail))
                        messages[id]["reactionAgree"].delete(userMail);
                    else
                        messages[id]["reactionAgree"].add(userMail);

                    sendUpdateCount(messages[id], io.to(roomName), userMail);
                    sendUpdateCount(messages[id], socket.broadcast);
                }
            }));

            socket.on('reaction', protect('REACTION', (content) => {
                if(!["👍", "👎", "🤔", "🤯", "😆", "🥰", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(content))
                    return;
                presentation.emit("reaction", {"content": content, "userhash": userHash});
            }));
        }
        else {
            //unauthenticated user, that just listen. Warn it.
            console.log("New listening-only user");
            socket.emit("unauthenticated", {});
        }

        // Send the history
        let tmpAry = [];
        for(let x in messages)
            if(messages[x]["author"] === userMail || isPublishedStatus(messages[x]["status"]))
                tmpAry.push(x);
        tmpAry.sort((a,b) => {return messages[a]["time"] - messages[b]["time"];});
        for(let x in tmpAry)
            sendMessage(messages[tmpAry[x]], socket, userMail);
    });
}

function init_app(production) {
    return connect.server({
        root: root,
        port: port,
        host: '0.0.0.0',
        livereload: !production,
        serverInit: function(server) {
            manage_io(server);
        },
        middleware: function(connect, opt) {
            return [
                require('connect-redirection')(),
                bodyParser.urlencoded({extended: false}),
                ["/metadata.xml", function(req, res) {
                    res.writeHead(200,{'Content-Type': 'application/xml'})
                    res.end(sp.create_metadata());
                }],
                ["/login", function(req, res) {
                    sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
                        if (err != null) {
                            res.writeHead(500);
                            res.end();
                            return;
                        }
                        res.redirect(login_url);
                    });
                }],
                ["/login-callback", function(req, res) {
                    var options = {request_body: req.body};
                    sp.post_assert(idp, options, function(err, saml_response) {
                        if (err != null) {
                            res.writeHead(500);
                            res.end();
                            return;
                        }

                        var cookies = getCookies(req, res);
                        cookies.set('userMail', saml_response.user.attributes["urn:oasis:names:tc:SAML:attribute:subject-id"][0], { signed: true });
                        cookies.set('userName', saml_response.user.attributes["urn:oid:2.16.840.1.113730.3.1.241"][0], { signed: true });

                        res.redirect("/student.html");
                    });
                }],
                ["/debug", function(req, res) {
                    var cookies = getCookies(req, res);
                    var userName = cookies.get('userName', { signed: true });
                    var userMail = cookies.get('userMail', { signed: true });
                    res.write("Session content " + userName + " (" + userMail +")");
                    res.end();
                }],
                ["/student.html", function(req, res, next) {
                    var cookies = getCookies(req, res);
                    var userName = cookies.get('userName', { signed: true });
                    var userMail = cookies.get('userMail', { signed: true });
                    if(userName === undefined || userMail === undefined)
                        res.redirect("/login");
                    else
                        next();
                }],
                ["/modo.html", function(req, res, next) {
                    var cookies = getCookies(req, res);
                    var userName = cookies.get('userName', { signed: true });
                    var userMail = cookies.get('userMail', { signed: true });
                    if(userName === undefined || userMail === undefined)
                        res.redirect("/login");
                    else if(checkModo(userName, userMail))
                        return next();
                    else
                        res.redirect("https://www.youtube.com/watch?v=RfiQYRn7fBg");
                }]
            ]
        }
    });
}

gulp.task('serve-prod', /*gulp.series('build', */() => {
    const app = init_app(true);
}/*)*/);

gulp.task('serve', () => {
    const app = init_app(false);

    gulp.watch(['*.html', '*.md'], gulp.series('reload'))
    gulp.watch(['courses/*/*.html'], gulp.series('reload'))

    gulp.watch(['js/**'], gulp.series('js', 'reload'))

    gulp.watch(['css/*.scss'], gulp.series('css', 'reload'))
});