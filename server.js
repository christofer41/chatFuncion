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
    socket.on("createRoom", (data) => {


      let theRoom = { id: data.room.id, usersOnline: data.room.usersOnline, locked: data.room.locked, password: data.room.password}
      allRooms.push(theRoom)

      connectRoom(socket, data)
    })
})

function connectRoom(socket, data) {
    socket.join(data.room.id, () => {
        // Se till att rensa upp blamd gamla events
        // socket.leaveAll();
        // socket.removeAllListeners('disconnect')
        // socket.removeAllListeners('message')

        io.to(socket.id).emit("Connected", data.room.id)

        io.emit("onconnected")

        socket.username = data.userName
        socket.room = data.room


        

        if(socket.room.locked) {
            let samePassword = checkPassword(socket.room)


            if(samePassword != true) {
                io.to(data.room.id).emit("wrong password", {
                    username: socket.username
                })
                return;
            }
        }

        const serverMessage = "Welcome " + socket.username + " to this chat";
        console.log(socket.username + " has connected to " + data.room.id)


        console.log(socket.adapter.rooms[data.room.id].length)
        socket.room.usersOnline = socket.adapter.rooms[data.room.id].length


        console.log(serverMessage)

        io.to(data.room.id).emit(
            'update chat', {
            username: socket.username,
            message: serverMessage,
            room: socket.room
        })
        
        socket.removeAllListeners("disconnect")
        socket.removeAllListeners("message")
        socket.removeAllListeners("forceDisconnect")

        socket.on("disconnect", () => {

            if(data.room.id !== "public" && data.room.id !== "admin") {
                if (socket.room.usersOnline === 1) {
                    console.log(socket.room)
    
    
                    for (let i = 0; i < allRooms.length; i++) {
                        if (allRooms[i].id == socket.room.id) {
                            allRooms.splice(i, 1);
                        }
                        
                    }
                }
            }



            if (data.room.id != "public") {
                console.log("meep")
            }

            


            io.emit("onconnected")
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
                message,
            })
        })


        socket.on("forceDisconnect", () => {
            io.emit("onconnected")

            


            // console.log(socket.room.usersOnline)


            if(data.room.id !== "public" && data.room.id !== "admin") {
                if (socket.adapter.rooms[data.room.id].length == 1) {
                    console.log(socket.room)
    
    
                    for (let i = 0; i < allRooms.length; i++) {
                        if (allRooms[i].id == socket.room.id) {
                            allRooms.splice(i, 1);
                        }
                        
                    }
                }
            }




            console.log(socket.adapter.rooms[data.room.id].length)
            
            socket.leave(data.room.id)
            io.to(data.room.id).emit(
                "update chat", {
                    username: socket.username,
                    message: " has left the server :(",
                    room: socket.room
                }
            )
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