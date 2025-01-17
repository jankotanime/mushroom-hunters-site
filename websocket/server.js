'use strict'
import connect from 'connect'
import serveStatic from 'serve-static'
import https from 'https'
import { Server } from 'socket.io'
import fs from 'fs';

const app = connect()
const options = {
  key: fs.readFileSync('./cerds/server.key'), 
  cert: fs.readFileSync('./cerds/server.crt'),
};
const httpsServer = https.createServer(options, app)
const io = new Server(httpsServer, {cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"]
}})


app.use(serveStatic("public"))

const messageGlobalQueue = [];
const messagePrivateQueue = [];
const messageHistoryQueue = [];

const messagePrivateHistory = {};

setInterval(() => {
    // ? Global queue for messages
    if (messageGlobalQueue.length > 0) {
        const {user, message} = messageGlobalQueue.shift()
        io.to('global').emit("message_global", user, message);
    }
    
    // ? Private queue for messages
    if (messagePrivateQueue.length > 0) {
        const {user, roommate, message} = messagePrivateQueue.shift()
        if (io.sockets.adapter.rooms.has(`${roommate}/${user}`)) {
            io.to(`${roommate}/${user}`).emit("message_private", user, message);
        } else {
            io.to(`${user}/${roommate}`).emit("message_private", user, message);
        }
    }
}, 1);

setInterval(() => {
    if (messageHistoryQueue.length > 0) {
        const {user, roommate, message, userId} = messageHistoryQueue.shift()
        if (io.sockets.adapter.rooms.has(`${roommate}/${user}`)) {
            io.to(userId).emit("message_private", user, message);
        } else {
            io.to(userId).emit("message_private", user, message);
        }
    }
}, 1);

io.sockets.on("connection", (socket) => {
    // ? Socket chatu globalnego
    socket.on("join_room_global", (user) => {
        socket.userId = user;
        socket.join('global')
        console.log(`${user} dołączył do pokoju: global`)
    })
    socket.on("send_message_global", (data) => {
        console.log(`${data['user']}: ${data['message']}`)
        messageGlobalQueue.push(data)
    })

    // ? Socket chatów prywatnych
    socket.on("join_room_private", (user, roommate) => {
        socket.userId = user;
        if (io.sockets.adapter.rooms.get(`${roommate}/${user}`)) {
            socket.join(`${roommate}/${user}`)
            if (messagePrivateHistory[`${roommate}/${user}`]) {
                messagePrivateHistory[`${roommate}/${user}`].forEach(element => {
                    const data = {user: element[0], message: element[1], roommate: roommate, userId: socket.id}
                    messageHistoryQueue.push(data)
                });
            }
            console.log(`${user} dołączył do pokoju: ${roommate}/${user}`)
        } else {
            socket.join(`${user}/${roommate}`)
            if (messagePrivateHistory[`${user}/${roommate}`]) {
                messagePrivateHistory[`${user}/${roommate}`].forEach(element => {
                    const data = {user: element[0], message: element[1], roommate: roommate, userId: socket.id}
                    messageHistoryQueue.push(data)
                });
            }
            console.log(`${user} dołączył do pokoju: ${user}/${roommate}`)
        }
    })
    socket.on("send_message_private", (data) => {
        const {user, message, roommate} = data
        console.log(`${data['user']} -> ${data['roommate']}: ${data['message']}`)
        if (io.sockets.adapter.rooms.has(`${roommate}/${user}`)) {
            const history = messagePrivateHistory[`${roommate}/${user}`]
            if (history) {
                messagePrivateHistory[`${roommate}/${user}`] = [...history, [user, message]]
            } else {
                messagePrivateHistory[`${roommate}/${user}`] = [[user, message]]
            }
        } else {
            const history = messagePrivateHistory[`${user}/${roommate}`] 
            if (history) {
                messagePrivateHistory[`${user}/${roommate}`] = [...history, [user, message]]
            } else {
                messagePrivateHistory[`${user}/${roommate}`] = [[user, message]]
            }
        }
        messagePrivateQueue.push(data)
    })
})

io.sockets.on("connect_error", () => {
    console.log("Błąd połączenia");
    setTimeout(() => {
        socket.connect();
    }, 2000)
})

httpsServer.listen(3001, function () {
    console.log('Serwer HTTP działa na pocie 3001')
})

// TODO refile kodu, usprawnić go i zoptymalizować
