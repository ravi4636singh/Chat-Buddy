const socket = io();
const userInfo = localStorage.getItem('userInfo');
const user = document.querySelector('.user-info span');
const liveUsersCounts = document.querySelector('#live_users');
const onlineUsers = document.querySelector('.online-users');
const form = document.querySelector('#form');
const message = document.querySelector('#message');
const mainContainer = document.querySelector('.msg-container');
const logoutBtn = document.querySelectorAll('.logout-btn');

user.textContent = userInfo;

let count = 0;

const createUserEle = (name, color, status) => {
	const div = document.createElement('div');
	div.classList.add('update-user');
	div.style.backgroundColor = color;
	div.textContent = `${name} ${status} the conversation`;
	mainContainer.appendChild(div);
};

// Join User Logic
userInfo && socket.emit('join', userInfo);

socket.on('connected', (username) => {
	createUserEle(username, '#03045e', 'Join');
	count++;
	liveUsersCounts.textContent = `Live : ${count}`;
	let onlineUsersEle = document.createElement('div');
	onlineUsersEle.classList.add('show-online-user');
	onlineUsersEle.textContent = username;
	onlineUsers.appendChild(onlineUsersEle);
});

// Exit User Logic
logoutBtn.forEach((btn) => {
	btn.addEventListener('click', () => {
		socket.emit('exit', userInfo);
		localStorage.removeItem('userInfo');
		location.pathname = '/';
	});
});

socket.on('disconnected', (username) => {
	createUserEle(username, 'red', 'Left');
	count--;
	liveUsersCounts.textContent = `Live : ${count}`;
	onlineUsers.removeChild();
});

// Rendering message's
const createMsgEle = (msgType, msgInfo) => {
	const div = document.createElement('div');
	div.classList.add(msgType);

	let senderMsgEle = `<div class="sender">
							<p
								class="sender-msg"
								style="font-size: 1rem; word-break: break-all"
							>
								${msgInfo.userMsg}
							</p>
						</div>`;

	let receiverMsgEle = `<div class="receiver">
							<span class="receiver-name">${msgInfo.username}</span>
							<p
								class="receiver-msg"
								style="font-size: 1rem; word-break: break-all"
							>
								${msgInfo.userMsg}
							</p>
						</div>`;

	div.innerHTML = msgType === 'outgoing-msg' ? senderMsgEle : receiverMsgEle;
	mainContainer.appendChild(div);
};

form.addEventListener('submit', (e) => {
	e.preventDefault();

	let msgInfo = {
		username: userInfo,
		userMsg: message.value,
	};

	socket.emit('message', msgInfo);
	createMsgEle('outgoing-msg', msgInfo);

	message.value = '';
});

socket.on('message', (msgInfo) => {
	createMsgEle('incoming-msg', msgInfo);
});
