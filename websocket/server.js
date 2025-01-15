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

io.sockets.on("connection", (socket) => {
    socket.on("join_room", (room, klient) => {
        socket.join(room)
        console.log(`${klient} dołączył do pokoju: ${room}`)
        socket.emit("room_joined", room)
    })

    socket.on("send_message", (data) => {
        const { room, user, message } = data;
        io.to(room).emit("message", user, message)
    })
})

httpServer.listen(3001, function () {
    console.log('Serwer HTTP działa na pocie 3001')
})
