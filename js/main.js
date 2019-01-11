const socket = io();

// On page load get List
window.onload = function (e) {
    socket.emit('updateList');

};

// when we get list
socket.on('listUpdate', (data) => {
    //console.log(data);

    document.getElementById('competitionTable').innerHTML = '';
    $('#competitionTable').append(
        '<thead class=\"thead-dark\">' +
        '< tr >' +
        '<th>Game ID</th>' +
        '<th>Player 1</th>' +
        '<th>Player 2</th>' +
        '<th>Winner</th>' +
        '<th>Score</th>' +
        '<th>Muuda</th>' +
        '<th>Kustuta </th>' +
        '</tr >' +
        '</thead>');


    for (let index = 0; index < data.length; index++) {
        $('#competitionTable').append(
            '<tr>' +
            '<td>' + data[index].gameID + '</td>' +
            '<td>' + data[index].player1 + '</td>' +
            '<td>' + data[index].player2 + '</td>' +
            '<td>' + data[index].winner + '</td>' +
            '<td>' + data[index].score + '</td>' +
            '<td><button onclick=\'changeRow("' + data[index]._id + '");\'>Change</button></td>' +
            '<td><button onclick="deleteRow(\'' + data[index]._id + '\');">Delete</button></td>' +
            '</tr>'
        );
    }
});

socket.on('refreshList', () => {
    socket.emit('updateList');
});

socket.on('updateForm', (data) => {

    document.getElementById('new_game').style.display = "none";
    document.getElementById('change_game').style.display = "block";

    document.getElementById("gameidChange").value = data.gameID;
    document.getElementById("player1Change").value = data.player1;
    document.getElementById("player2Change").value = data.player2;
    document.getElementById("winnerChange").value = data.winner;
    document.getElementById("scoreChange").value = data.score;
    console.log(data)
    document.getElementById("idChange").value = data._id;

});


function add_new_item() {

    socket.emit('newItem', {
        gameID: document.getElementById("gameid").value,
        player1: document.getElementById("player1").value,
        player2: document.getElementById("player2").value,
        winner: document.getElementById("winner").value,
        score: document.getElementById("score").value
    })

    document.getElementById("gameid").value = "";
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
    document.getElementById("winner").value = "";
    document.getElementById("score").value = "";
};


function change_row() {

    socket.emit('updateRow', {
        gameID: document.getElementById("gameidChange").value,
        player1: document.getElementById("player1Change").value,
        player2: document.getElementById("player2Change").value,
        winner: document.getElementById("winnerChange").value,
        score: document.getElementById("scoreChange").value,

        id: document.getElementById("idChange").value
    })

    document.getElementById('change_game').style.display = "none";
    document.getElementById('new_game').style.display = "block";

};


function deleteRow(itemID) {
    socket.emit('deleteItem', {
        id: itemID
    });
};


function changeRow(itemID) {
    socket.emit('getChangeRow', {
        id: itemID
    });
};