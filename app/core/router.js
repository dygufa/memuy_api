var restify = require('restify'), 
    fs = require('fs'),
    socketio_options = {}

var server = restify.createServer()
server.use(restify.fullResponse()).use(restify.bodyParser())
    
if (process.env.NODE_ENV == 'dev') {
    server.use(restify.CORS())

    // Lets try and fix CORS support
    // By default the restify middleware doesn't do much unless you instruct
    // it to allow the correct headers.
    //
    // See issues:
    // https://github.com/mcavage/node-restify/issues/284 (closed)
    // https://github.com/mcavage/node-restify/issues/664 (unresolved)
    //
    // What it boils down to is that each client framework uses different headers
    // and you have to enable the ones by hand that you may need.
    // The authorization one is key for our authentication strategy
    //
    restify.CORS.ALLOW_HEADERS.push( "authorization"        );
    restify.CORS.ALLOW_HEADERS.push( "withcredentials"      );
    restify.CORS.ALLOW_HEADERS.push( "x-requested-with"     );
    restify.CORS.ALLOW_HEADERS.push( "x-forwarded-for"      );
    restify.CORS.ALLOW_HEADERS.push( "x-real-ip"            );
    restify.CORS.ALLOW_HEADERS.push( "x-customheader"       );
    restify.CORS.ALLOW_HEADERS.push( "user-agent"           );
    restify.CORS.ALLOW_HEADERS.push( "keep-alive"           );
    restify.CORS.ALLOW_HEADERS.push( "host"                 );
    restify.CORS.ALLOW_HEADERS.push( "accept"               );
    restify.CORS.ALLOW_HEADERS.push( "connection"           );
    restify.CORS.ALLOW_HEADERS.push( "upgrade"              );
    restify.CORS.ALLOW_HEADERS.push( "content-type"         );
    restify.CORS.ALLOW_HEADERS.push( "dnt"                  ); // Do not track
    restify.CORS.ALLOW_HEADERS.push( "if-modified-since"    );
    restify.CORS.ALLOW_HEADERS.push( "cache-control"        );

    // Manually implement the method not allowed handler to fix failing preflights
    //
    server.on( "MethodNotAllowed", function( request, response )
    {
        if ( request.method.toUpperCase() === "OPTIONS" )
        {
            // Send the CORS headers
            //
            response.header( "Access-Control-Allow-Credentials", true                                    );
            response.header( "Access-Control-Allow-Headers",     restify.CORS.ALLOW_HEADERS.join( ", " ) );
            response.header( "Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS"       );
            response.header( "Access-Control-Allow-Origin",      request.headers.origin                  );
            response.header( "Access-Control-Max-Age",           0                                       );
            response.header( "Content-type",                     "text/plain charset=UTF-8"              );
            response.header( "Content-length",                   0                                       );

            response.send( 204 );
        }
        else
        {
            response.send( new restify.MethodNotAllowedError() );
        }
    } );

    socketio_options = {'origins': '*:*'}
}

var socketio = require('socket.io')(socketio_options),
    io = socketio.listen(server.server)

var controllers = {}, 
    controllers_path = process.cwd() + '/app/controllers'

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
})

io.on('connection', controllers.socket)

server.post("/files", controllers.file.addFile(io))
server.put("/files/:id", controllers.file.updateFile(io))
server.del("/files/:id", controllers.file.deleteFile(io))



server.get(/\/public\/?.*/, restify.serveStatic({
    'directory': './static_content'
}));

server.get(/.*/, restify.serveStatic({
    'directory': 'static_content',
    file: 'public/index.html'
}));

server.get(/.*/, function(req, res, next) {
    res.send({msg: 'oi'})
})

var port = process.env.PORT || 3000;

server.listen(port, function (err) {
    if (err) {
        console.error(err)
    } else {
        console.log('App is ready at : ' + port)
    }
})

if (process.env.environment == 'production') {
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
    })
}
