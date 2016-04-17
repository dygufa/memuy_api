var restify = require('restify'), 
    fs = require('fs')

var controllers = {}, 
    controllers_path = process.cwd() + '/app/controllers'

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
})

var server = restify.createServer();
server.use(restify.fullResponse()).use(restify.bodyParser())

server.get("/keys/generate", controllers.key.generateKey)
server.post("/keys/verify", controllers.key.verifyKey)

server.get("/files/", controllers.file.indexFiles)
server.post("/files", controllers.file.addFile)
server.get("/files/:id", controllers.file.getFile)
server.put("/files/:id", controllers.file.updateFile)
server.del("/files/:id", controllers.file.deleteFile)

var port = process.env.PORT || 3000;

server.listen(port, function (err) {
    if (err) {
        console.error(err)
    } selse {
        console.log('App is ready at : ' + port)
    }
})

if (process.env.environment == 'production') {
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
    })
}
