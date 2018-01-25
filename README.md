# Memuy
App for sharing file between devices using short urls.

## Using

### Response 

The response from the API is formatted as:

```
{
    status: fail | success
    data?: any 
    error?:  Error
} 

Error {
    name: string
    message: string
}
```

In case of success the API will return a 200 HTTP Code along with the "ok" parameter defined as true. In case of error the HTTP code will be the one that best fit the situation, "ok" will be false and "data" will return an object with the error name and the message related to the error.

### Endpoints

URL | Content-Type | Body (POST) | Success Response |
--- | --- | --- | ---
GET /rooms/:id | - | - | Room
POST /rooms | - | - | Room
POST /files | `multipart/form-data` | Keys: i) roomName: containing the room's name; ii) file: the file to be uploaded. | File
DELETE /files/:id | - | - | -

### Websocket

In order to notify all tabs with a specific room open about new uploaded files there's an instance of socket.io running. When a new file is sent to a room an event named "newFile" is broadcasted to the socket's room with the same name of the room, the payload of that message is:

```
{
    roomName: string
    file: File
}  
```

### Types


#### Room
```
Room {
    name: string
    status: string
    usedSpace: number
    maxSpace: number
    files: File[]
    createdAt: Date
    expiresOn: Date
}
```
#### File
```
File {
    name: string
    location: string
    size: number
    mimetype: string
    hash: string
}
```

## Development

### Requirements:

* Node.js
* MongoDB
* AWS Account

### Get the code:
```
git clone https://github.com/dygufa/memuy_api.git
cd memuy_api
yarn
```

### Define the environment variables

In order to run this webserver you need to define the `.env` file using the `.env.example`:

```
cp .env.example .env
nano .env
```

### Commands:

- `yarn dev` will start a express webserver (mpmv.js) using nodemon and a tsc --watch instance to auto compile on file change. The port can be defined on the `.env` file.

## Todos (by priority)

- [ ] Sentry
- [ ] Unit test
