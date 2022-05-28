/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var async = require('async');

var express = require('express');
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

const fs = require("fs");
const { constants } = require('buffer');
const { LiveTvOutlined } = require('@material-ui/icons');


mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    const session_userID = request.session.user_id;
    if (!session_userID) {
        response.status(401).send('Invalid user');
        return;
    }
    User.find().select('first_name last_name').exec((err, userArray) => {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/info error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        response.end(JSON.stringify(userArray));
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    const session_userID = request.session.user_id;
    if (!session_userID) {
        response.status(401).send('Invalid user');
        return;
    }
    const id = request.params.id;
    User.findOne({_id: id}).select('first_name last_name location description occupation').exec((err, user) => {
        if (err) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        response.end(JSON.stringify(user));
    }); 
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    const session_userID = request.session.user_id;
    if (!session_userID) {
        response.status(401).send('Invalid user');
        return;
    }
    const id = request.params.id;
    Photo.find({user_id: id}).select('user_id comments file_name date_time').exec((err, photos) => {
        if (err) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        const photosArray = JSON.parse(JSON.stringify(photos));
        
        async.each(photosArray, function(photo, photo_done) {
            async.each(photo.comments, function(comment, comment_done) {
                User.findOne({_id: comment.user_id}).select('first_name last_name')
                                                              .exec((errorUser, user) => {
                    if (errorUser) {
                        console.log('User with _id:' + comment.user_id + ' not found.');
                        comment_done(errorUser);
                        return;
                    }
                    comment.user = user;
                    delete comment.user_id;
                    comment_done();
                });
            }, function(errorComment) { 
                if (errorComment) {
                    photo_done(errorComment);
                } else {
                    photo_done();
                }
            });
        }, function(errorPhotos) { 
            if (errorPhotos) {
                response.status(400).send('Comment user not found');
            } else {
                response.status(200).send(photosArray);
            }
        });
    });
});

app.post('/admin/login', function (request, response) {
    const loginName = request.body.login_name; 
    const password = request.body.password; 
    User.findOne({login_name: loginName}).exec((err, user) => {
        if (err || !user) {
            console.log('User with login_name:' + loginName + ' not found.');
            response.status(400).send('User with login name not found');
            return; 
        }
        if (user.password !== password) {
            response.status(400).send('Password incorrect.');
            return;
        }
        //mark session as being logged in 
        request.session.user_id = user._id;
        request.session.login_name = loginName;
        response.status(200).send({
            _id: user._id, 
            first_name: user.first_name,
        });
    });
    
});

app.post('/admin/logout', function(request, response) {
    const sessionData = request.session;
    if (!sessionData.user_id) {
        response.status(400).send('Not logged in.');
    } else {
        sessionData.destroy(function(err) {
            response.status(200).send("Successfully logged out.");
            return;
        });
    }
});
//ability to add comments
app.post('/commentsOfPhoto/:photo_id', function(request, response) {
    const session_userID = request.session.user_id;
    if (!session_userID) {
        response.status(401).send('Invalid user');
        return;
    }
    const comment_text = request.body.comment;
    if (!comment_text) {
        response.status(400).send('Invalid comment');
        return;
    }
    const id = request.params.photo_id;
    Photo.findOne({_id: id}, function(err, photo) {
        if (err || !photo) {
            console.log('Photo not found.');
            response.status(400).send('Photo not found.');
            return; 
        }
        photo.comments.push({
            comment: comment_text,
            user_id: session_userID,
        });
        photo.save();
        response.status(200).send();
    });

});
//ability to upload photos 
app.post('/photos/new', function(request, response) {
    const session_userID = request.session.user_id;
    if (!session_userID) {
        response.status(401).send('Invalid user');
        return;
    }
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            return;
        }
    
        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;
    
        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            if (err) {
                response.status(400).send("Could not write file");
            }
            Photo.create({
                    file_name: filename,
                    user_id: session_userID,
                    date_time: timestamp,
                    comments: [],
                }, 
                function(err, photo) {
                    if (err) {
                        response.status(400).send(JSON.stringify(err));
                        return;
                    } 
                    photo.save();
                    response.status(200).send();
                }
            )
        });
    });

});
//ability to register 
app.post('/user', function(request, response) {
    const password = request.body.password;
    if (password.length() === 0) {
        response.status(400).send('Password cannot be empty.')
        return; 
    }
    const loginName = request.body.login_name;
    User.findOne({login_name: loginName}, function(err, user) {
        if (err) {
            response.status(400).send('Username verification failed.');
            return;
        }
        if (user.length >= 0) {
            response.status(400).send('Username already exists.');
            return;
        }

        const firstName = request.body.first_name;
        const lastName = request.body.last_name;
        const location = request.body.location;
        const description = request.body.description;
        const occupation = request.body.occupation;

        User.create(loginName, password, firstName, lastName, location, description, occupation, function(err) {
            if (err) {
                response.status(400).send(JSON.stringify(error));
                return;
            }
            response.status(200).send('User registeration successful.')
        })

    })
})

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


