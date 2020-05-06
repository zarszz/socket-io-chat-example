var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/homepage.html');
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let users = []

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
    socket.on('chat message', (data) => {
        io.emit('chat message', `${data.nickname} : ${data.message}`);
    });
    socket.on('user-connected', (nickname) => {
        io.emit('user-connected', `${nickname} connected`);
        users.push(nickname);
    })
    socket.on('user-logout', (nickname) => {
        users.indexOf(nickname) !== -1 && users.splice(users.indexOf(nickname), 1);
        io.emit('user-logged-out', `${nickname} logged out`);
    })
    socket.on("show-online", () => {
        data =  {
            users: users,
            count: users.length
        };
        io.emit('show-online', data);
    })
})

http.listen(3000, () => {
    console.log('list on http://localhost:3000');
});