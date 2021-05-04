const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

app.use(express.static('public'))

let allRooms = [
    { id: "admin", usersOnline: 0, locked: true, password: "admin"},
    { id: "public", usersOnline: 0, locked: false, password: ""}
];

app.get("/allRooms", (req,res) => {
    res.json(allRooms)
});

io.on("connection", (socket) => {
    //The user joins a room
    socket.on("join room", (data) => {
        console.log(data)
    })
})

server.listen(port, () => console.log(`Server is running on http://${host}:${port}`))