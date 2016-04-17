/*
Enviroment variable to be defined:

- MONGO_URL: As it says... the mongo URL
- PORT: The port where the application will be running
*/

require('./app/core/mongoose')
require('./app/core/router')