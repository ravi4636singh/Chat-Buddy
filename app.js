const express = require('express');
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = 8080;
const io = new Server(server);

server.listen(PORT, () =>
	console.log(`Server Start: http://localhost:${PORT}`)
);

app.use(express.static(path.join(__dirname, '/public/')));

app.set('view engine', 'ejs');
app.set('views', './public');

app.get('/', (req, res) => {
	res.render('loginPage');
});

app.get('/login/:username', (req, res) => {
	res.status(200).end();
});

app.get('/login', (req, res) => {
	res.render('loginPage');
});

app.get('/chat', (req, res) => {
	io.on('connection', (socket) => {
		socket.on('join', (username) => {
			socket.broadcast.emit('connected', username);
		});

		socket.on('exit', (username) => {
			socket.broadcast.emit('disconnected', username);
		});

		socket.on('message', (msgInfo) => {
			socket.broadcast.emit('message', msgInfo);
		});
	});

	res.render('index');
});
