const socket = io();


// On page load get List
window.onload = function (e) {
    socket.emit('updateList');

};


// when we get list
socket.on('listUpdate', (data) => {
    //console.log(data);

    // Add header of the table
    document.getElementById('competitionTable').innerHTML = '';
    $('#competitionTable').append(
        '<thead class=\"thead-dark align-middle\">' +
        '< tr >' +
        '<th class="text-center">Game ID</th>' +
        '<th>Player 1</th>' +
        '<th>Player 2</th>' +
        '<th>Winner</th>' +
        '<th class="text-center">Score</th>' +
        '<th class="text-center">Muuda</th>' +
        '<th class="text-center">Kustuta </th>' +
        '</tr >' +
        '</thead>');

    // cycle trought the data and display it accordingly to table
    for (let index = 0; index < data.length; index++) {
        $('#competitionTable').append(
            '<tr>' +
            '<td class="text-center align-middle">' + data[index].gameID + '</td>' +
            '<td class="align-middle">' + data[index].player1 + '</td>' +
            '<td class="align-middle">' + data[index].player2 + '</td>' +
            '<td class="align-middle">' + data[index].winner + '</td>' +
            '<td class="text-center align-middle">' + data[index].score + '</td>' +
            '<td><button class="btn btn-success btn-block align-middle" onclick=\'changeRow("' + data[index]._id + '");\'>Change</button></td>' +
            '<td><button class="btn btn-danger btn-block align-middle" onclick="deleteRow(\'' + data[index]._id + '\');">Delete</button></td>' +
            '</tr>'
        );
    }
});


// Refresh and update list
socket.on('refreshList', () => {
    socket.emit('updateList');
});


// update Form
socket.on('updateForm', (data) => {

    // Hide id="new_game"
    document.getElementById('new_game').style.display = "none";
    // Display id="change_game"
    document.getElementById('change_game').style.display = "block";

    document.getElementById("gameidChange").value = data.gameID;
    document.getElementById("player1Change").value = data.player1;
    document.getElementById("player2Change").value = data.player2;
    document.getElementById("winnerChange").value = data.winner;
    document.getElementById("scoreChange").value = data.score;
    console.log(data)
    document.getElementById("idChange").value = data._id;

});


// Add new item from Form and send it then clear the form
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

    hide_add_game_form()
};


// Change item from Form and send it. Then display new form.
function change_row() {

    socket.emit('updateRow', {
        gameID: document.getElementById("gameidChange").value,
        player1: document.getElementById("player1Change").value,
        player2: document.getElementById("player2Change").value,
        winner: document.getElementById("winnerChange").value,
        score: document.getElementById("scoreChange").value,

        id: document.getElementById("idChange").value
    })

    // Hide id="change_game"
    document.getElementById('change_game').style.display = "none";
    // Display id="new_game"
    document.getElementById('new_game').style.display = "block";

};

function show_add_game_form() {
    // Display id="new_game"
    document.getElementById('new_game').style.display = "block";
};

function hide_add_game_form() {
    // Hide id="new_game"
    document.getElementById('new_game').style.display = "none";
};


// Delete row
function deleteRow(itemID) {
    socket.emit('deleteItem', {
        id: itemID
    });
};

// Change row
function changeRow(itemID) {
    socket.emit('getChangeRow', {
        id: itemID
    });
};