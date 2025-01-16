'use strict'
import connect from 'connect'
import serveStatic from 'serve-static'
import http from 'http'
import { Server } from 'socket.io'

const app = connect()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"]
}})

app.use(serveStatic("public"))

const messageGlobalQueue = [];
const messagePrivatelQueue = [];

setInterval(() => {
    // ? Global queue for messages
    if (messageGlobalQueue.length > 0) {
        const {user, message} = messageGlobalQueue.shift()
        io.to('global').emit("message_global", user, message);
    }
    // ? Private queue for messages
    if (messagePrivatelQueue.length > 0) {
        const {user, roommate, message} = messagePrivatelQueue.shift()
        if (io.sockets.adapter.rooms.has(`${roommate}-${user}`)) {
            io.to(`${roommate}-${user}`).emit("message_private", user, message);
        } else {
            io.to(`${user}-${roommate}`).emit("message_private", user, message);
        }
    }
}, 1);

io.sockets.on("connection", (socket) => {
    // ? Socket chatu globalnego
    socket.on("join_room_global", (user) => {
        socket.join('global')
        console.log(`${user} dołączył do pokoju: global`)
    })
    socket.on("send_message_global", (data) => {
        console.log(`${data['user']}: ${data['message']}`)
        messageGlobalQueue.push(data)
    })

    // ? Socket chatów prywatnych
    socket.on("join_room_private", (user, roommate) => {
        if (io.sockets.adapter.rooms.has(`${roommate}-${user}`)) {
            socket.join(`${roommate}-${user}`)
            console.log(`${user} dołączył do pokoju: ${roommate}-${user}`)
        } else {
            socket.join(`${user}-${roommate}`)
            console.log(`${user} dołączył do pokoju: ${user}-${roommate}`)
        }
    })
    socket.on("send_message_private", (data) => {
        console.log(`${data['user']}: ${data['message']} to ${data['roommate']}`)
        messagePrivatelQueue.push(data)
    })
})

io.sockets.on("connect_error", () => {
    console.log("Błąd połączenia");
    setTimeout(() => {
        socket.connect();
    }, 2000)
})

httpServer.listen(3001, function () {
    console.log('Serwer HTTP działa na pocie 3001')
})
