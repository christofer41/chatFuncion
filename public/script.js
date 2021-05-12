const socket = io();
let selectedRoom = '';
let allRooms;

//Our socket connections
socket.on('Connected', renderChat);
socket.on('update chat', renderMessage);
socket.on('wrong password', wrongPassword);



//We collect all the rooms that have been created
function printRooms() {
    fetch('http://localhost:3000/allRooms')
    .then((response) => {
        return response.json();
    })
    .then((rooms) => {
        showAllRooms(rooms);
    });

}


//Event listeners
window.addEventListener('load', () => {
    printRooms()


    const messageButton = document.getElementById('message-button');
    messageButton.addEventListener('click', sendMessage);

    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', renderHome);

    const creatroom = document.getElementById('roomcreat');
    creatroom.addEventListener('click', renderCreatRooms);

    const homeButton2 = document.getElementById('homes');
    homeButton2.addEventListener('click', renderHome);

    const createPublicRoom = document.getElementById("chat-room-public");
    createPublicRoom.addEventListener("click", createRoom);

    const createprivateRoom = document.getElementById("chat-room-private");
    createprivateRoom.addEventListener("click", createRoom);

     renderHome();
});

//What happens when we render the chat.
function renderChat(socket) {
    console.log('Hello');
}
//What happens when we render the message
function renderMessage(socket) {
    printRooms()
    renderChatpage()


    const board = document.getElementById('message-here');
    const theMessage = document.createElement('li');
    console.log(socket);
    theMessage.innerHTML = socket.username + ': ' + socket.message;
    board.append(theMessage);
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
    let lockedRoomBox = document.getElementById('private');
    let unlockedRoomBox = document.getElementById('public');

    unlockedRoomBox.innerHTML = ""
    lockedRoomBox.innerHTML = ""

    //If no rooms exist we return null
    if (!lockedRoomBox && !unlockedRoomBox) {
        return;
    }

    rooms.forEach((rooms) => {
        console.log(rooms);

        if (rooms.locked) {
            let roomTh = document.createElement('th');
            let room = document.createElement('th');
            room.innerText = rooms.id;
            room.className = 'lockedRooms';

            roomTh.appendChild(room);
            lockedRoomBox.appendChild(roomTh);
        } else {
            let roomTh = document.createElement('th');
            let room = document.createElement('th');
            room.innerText = rooms.id;
            room.className = 'unlockedRooms';

            roomTh.appendChild(room);
            unlockedRoomBox.appendChild(roomTh);
        }

        //Add event listeners
    });
    addEvents();
}

//We give all rooms a click event
function addEvents() {
    let lockedRoomBox = document.getElementsByClassName('lockedRooms');
    let unlockedRoomBox = document.getElementsByClassName('unlockedRooms');

    for (let i = 0; i < lockedRoomBox.length; i++) {
        lockedRoomBox[i].addEventListener('click', () => {


            selectedRoom = lockedRoomBox[i].innerText;
            console.log(selectedRoom);
            joinRoom();
        });
    }

    for (let i = 0; i < unlockedRoomBox.length; i++) {
        unlockedRoomBox[i].addEventListener('click', () => {


            selectedRoom = unlockedRoomBox[i].innerText;
            console.log(selectedRoom);
            joinRoom();
        });
    }
}

//What happens when a user joins a room
function joinRoom() {
    let lockedRoomBox = document.getElementsByClassName('lockedRooms');
    let unlockedRoomBox = document.getElementsByClassName('unlockedRooms');
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
    let userName = document.getElementById("username-input").value;

    if(userName == "" || userName == null) {
        alert("Please enter a username")
        return;
    }

    

    if (locked == false) {
        let room = new Room(selectedRoom, locked);
        socket.emit("join room", {userName, room})
    } else {
        let password = prompt("Please enter password")
        let room = new Room(selectedRoom, locked, password);
        socket.emit("join room", {userName, room})
    }
}

//What happens when a user sends a message
function sendMessage(event) {
    event.preventDefault();
    const theInput = document.getElementById('messageInput');
    let theMessage = theInput.value;

    if (theMessage === '' || theMessage === null) {
        return;
    } else {
        socket.emit('message', theMessage);
        theMessage = '';
    }
}


function wrongPassword(socket) {
    alert("The password was incorrect!")
}


function createRoom(event) {
    event.preventDefault();
    let roomName = document.getElementById("room-name").value;
    let roomPassword = document.getElementById("room-password").value;
    let userName = document.getElementById("username-input").value;
    let locked = false;


    if (roomName == "" || roomName == null) {
        alert("Please enter a room name")
        return;
    }



    if (userName == "" || userName == null) {
        alert("Please enter a username")
        return;
    }

    if (event.target.id == "chat-room-private") {
        if (roomPassword == "" || roomPassword == null) {
            alert("Please enter a password")
            return;
        }
        locked = true;
    }

    let room = new Room(roomName, locked, roomPassword);
    socket.emit("createRoom", {userName, room})
}



let frontPage = document.getElementById('frontPage');
let chatPage = document.getElementById('chatPage');
let create = document.getElementById('create-rooom');

function renderHome() {
    frontPage.style.display = 'block';
    chatPage.style.display = 'none';
    create.style.display = 'none';

    let data = "hello"


    socket.emit("forceDisconnect")
}
function renderChatpage() {
    chatPage.style.display = 'block';
    create.style.display = 'none';
    frontPage.style.display = 'none';
}
function renderCreatRooms() {
    chatPage.style.display = 'none';
    create.style.display = 'block';
    frontPage.style.display = 'block';
}
