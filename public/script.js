fetch("http://localhost:3000/allRooms").then((response) => {
    return response.json()
}).then((room) => {
    console.log(room)
})