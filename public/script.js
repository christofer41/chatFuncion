const socket = io()
let selectedRoom = "";
let allRooms;



//Our socket connections
socket.on('Connected', renderChat)
socket.on('update chat', renderMessage)

//We collect all the rooms that have been created
fetch("http://localhost:3000/allRooms").then((response) => {
    return response.json()
}).then((rooms) => {
    showAllRooms(rooms)
})



//Event listeners
const messageButton = document.getElementById("message-button")
messageButton.addEventListener('click', sendMessage)


//What happens when we render the chat.
function renderChat(socket) {
     console.log("Hello");

}
//What happens when we render the message
function renderMessage(socket) {
    const board = document.getElementById("message-here");
    const theMessage = document.createElement("li");
    console.log(socket)
    theMessage.innerHTML = socket.username + ": " + socket.message;
    board.append(theMessage)
}

//The class for the room
class Room {
    constructor(id, locked, password) {
        this.id = id;
        this.usersOnline = 0;
        this.locked = locked;
        this.password = password;
    }
}


//We render all rooms
function showAllRooms(rooms) {
    let lockedRoomBox = document.getElementById("private")
    let unlockedRoomBox = document.getElementById("public")

    //If no rooms exist we return null
    if (!lockedRoomBox && !unlockedRoomBox){
        return;
    }



    rooms.forEach(rooms => {
        console.log(rooms)

        if (rooms.locked) {
            let roomTh = document.createElement("th");
            let room = document.createElement("th");
            room.innerText = rooms.id;
            room.className = "lockedRooms"


            roomTh.appendChild(room);
            lockedRoomBox.appendChild(roomTh);
        } else {
            let roomTh = document.createElement("th");
            let room = document.createElement("th");
            room.innerText = rooms.id;
            room.className = "unlockedRooms"


            roomTh.appendChild(room);
            unlockedRoomBox.appendChild(roomTh);
        }

        //Add event listeners
    })
    addEvents()
}

//We give all rooms a click event
function addEvents() {
    let lockedRoomBox = document.getElementsByClassName("lockedRooms")
    let unlockedRoomBox = document.getElementsByClassName("unlockedRooms")


    for (let i = 0; i < lockedRoomBox.length; i++) {
        lockedRoomBox[i].addEventListener("click", () => {

            for (let y = 0; y < lockedRoomBox.length; y++) {
                lockedRoomBox[y].style.border = "none"
            }
            for (let u = 0; u < unlockedRoomBox.length; u++) {
                unlockedRoomBox[u].style.border = "none"
            }

            selectedRoom = lockedRoomBox[i].innerText;
            lockedRoomBox[i].style.border = "2px solid green"
            console.log(selectedRoom);
            joinRoom()
        })
        
    }

    for (let i = 0; i < unlockedRoomBox.length; i++) {
        unlockedRoomBox[i].addEventListener("click", () => {

            for (let y = 0; y < lockedRoomBox.length; y++) {
                lockedRoomBox[y].style.border = "none"
            }
            for (let u = 0; u < unlockedRoomBox.length; u++) {
                unlockedRoomBox[u].style.border = "none"
            }

            selectedRoom = unlockedRoomBox[i].innerText;
            unlockedRoomBox[i].style.border = "2px solid green"
            console.log(selectedRoom);
            joinRoom()
        })
        
    }
}

//What happens when a user joins a room
function joinRoom() {

    let lockedRoomBox = document.getElementsByClassName("lockedRooms");
    let unlockedRoomBox = document.getElementsByClassName("unlockedRooms");
    let locked = false;

    for (let i = 0; i < lockedRoomBox.length; i++) {
        if (lockedRoomBox[i].innerHTML == selectedRoom) {
            locked = true;
        }
    }

    for (let i = 0; i < unlockedRoomBox.length; i++) {
        if (unlockedRoomBox[i].innerHTML == selectedRoom) {
            locked = false;
        }
    }


        let userName = "Testuser"
        let room = new Room(selectedRoom, locked);
        socket.emit("join room", {userName, room})





}

//What happens when a user sends a message
function sendMessage(event) {
    event.preventDefault()
    const theInput = document.getElementById("messageInput");
    let theMessage = theInput.value

    if (theMessage === "" || theMessage === null) {
        return;
    } else {
        socket.emit("message", theMessage)
        theMessage = "";
    }

}

