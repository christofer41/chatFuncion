const socket = io()
let selectedRoom = "";
let allRooms;


fetch("http://localhost:3000/allRooms").then((response) => {
    return response.json()
}).then((rooms) => {
    showAllRooms(rooms)
    
})

class Room {
    constructor(id, locked, password) {
        this.id = id;
        this.usersOnline = 0;
        this.locked = locked;
        this.password = password;
    }
}



function showAllRooms(rooms) {
    let lockedRoomBox = document.getElementById("private")
    let unlockedRoomBox = document.getElementById("public")


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


function joinRoom(event) {
    console.log("test")
    // event.preventDefault();

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

function renderMainMenu(){
    if(document.queryCommandValue('')){

    }
}