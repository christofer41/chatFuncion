const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

app.use(express.static('public'))

allRooms = [
    { id: "admin", usersOnline: 0, locked: true, password: "admin"},
    { id: "public", usersOnline: 0, locked: false, password: ""}
];

app.get("/allRooms", (req,res) => {
    res.json(allRooms)
});

io.on("connection", (socket) => {
    //The user joins a room
    socket.on("join room", (data) => {
        connectRoom(socket, data)
    })
})





function connectRoom(socket, data) {
    socket.join(data.room.id, () => {
        io.to(socket.id).emit("Connected", data.room.id)

        socket.username = data.userName
        socket.room = data.room

        if(socket.room.locked) {
            let samePassword = checkPassword(socket.room)


            if(samePassword != true) {
                return;
            }
        }

        const serverMessage = "Welcome " + socket.username + " to this chat";
        console.log(socket.username + " has connected to " + data.room.id)


        console.log(serverMessage)

        io.to(data.room.id).emit(
            'update chat', {
            username: socket.username,
            message: serverMessage
        })

        socket.on("disconnect", () => {
            io.to(data.room.id).emit(
                "update chat", {
                    username: socket.username,
                    message: " has left the server :("
                }
            )
        })

        socket.on("message", (message) => {
            console.log(message)
            io.to(data.room.id).emit("update chat", {
                username: socket.username,
                message
            })
        })

    })
}



function checkPassword(socketRoom) {


    for (let i = 0; i < allRooms.length; i++) {

        if (allRooms[i].id == socketRoom.id) {
            if (allRooms[i].password == socketRoom.password) {
                console.log("yes")
                return true;

            }
        }
    }


}

server.listen(port, () => console.log(`Server is running on http://${host}:${port}`))