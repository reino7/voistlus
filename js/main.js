const socket = io.connect('http://localhost:3012');

// On page load get List
window.onload = function (e) {
    socket.emit('updateList');

};

// when we get list
socket.on('listUpdate', (data) => {
    console.log(data);
    for (let index = 0; index < data.length; index++) {
        $('#competitionTable').append(
            '<tr>' +
            '<td>' + data[index].gameID + '</td>' +
            '<td>' + data[index].player1 + '</td>' +
            '<td>' + data[index].player2 + '</td>' +
            '<td>' + data[index].winner + '</td>' +
            '<td>' + data[index].score + '</td>' +
            '<td><a href="#" onclick="change_row(\'' + data[index]._id + '\');">Change</a></td>' +
            '<td><a href="#" onclick="deleteRow(\'' + data[index]._id + '\');">Delete</a></td>' +
            '</tr>'
        );
    }
});

function add_new_item() {

    socket.emit('newItem', {
        gameID: document.getElementById("gameid").value,
        player1: document.getElementById("player1").value,
        player2: document.getElementById("player2").value,
        winner: document.getElementById("winner").value,
        score: document.getElementById("score").value
    })
};


function deleteRow(itemID) {
    socket.emit('deleteItem', {
        id: itemID
    });
};