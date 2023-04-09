const socket = io()
const joinSection = document.querySelector('.join-section')
const chatSection = document.querySelector('.chat-section')
const username = document.querySelector('#username')
const joinBtn = document.querySelector('.join-btn')
const exitBtn = document.querySelector('.exit-btn')
const form = document.querySelector('.form-input')
const message = document.querySelector('.message')
const mainDiv = document.querySelector('.msg-wrapper')

let uname

joinBtn.addEventListener('click', () => {
    uname = username.value

    if(uname){
        joinSection.classList.add('active')
        chatSection.classList.remove('active')
        
        socket.emit('join user', uname)
    }else{
        alert('Please! Enter Username')
    }
})

const msgRenders = (msgType, msgInfo) => {
    const div = document.createElement('div')
    div.classList.add(msgType)

    const innerDiv = document.createElement('div')

    const span = document.createElement('span')
    span.textContent = msgInfo.username
    
    const hr = document.createElement('hr')
    
    const p = document.createElement('p')
    p.textContent = msgInfo.message

    if(msgType === 'outgoing'){
        innerDiv.classList.add('sender')
        span.classList.add('sender-name')
        p.classList.add('sender-msg')
    }else if(msgType === 'incoming'){
        innerDiv.classList.add('receiver')
        span.classList.add('receiver-name')
        p.classList.add('receiver-msg')
    }

    innerDiv.appendChild(span)
    innerDiv.appendChild(hr)
    innerDiv.appendChild(p)
    div.appendChild(innerDiv)
    mainDiv.appendChild(div)
}

// Outgoing Messages
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let msg = message.value

    if(msg){
        let msgInfo = {
            username: uname,
            message: msg
        }
        msgRenders('outgoing', msgInfo)
        socket.emit('new message', msgInfo)
        message.value = ''
    }else{
        alert('Write Something...')
    }
})

// Incoming Messages
socket.on('new message', (msgInfo) => {
    msgRenders('incoming', msgInfo)
})

// Join User
const joinUser = (name) => {
    const div = document.createElement('div')
    div.classList.add('user-update')
    div.textContent = `${name} join this conversation`
    mainDiv.appendChild(div)
}

socket.on('connected', (uname) => {
    joinUser(uname)
})

// Exit User
exitBtn.addEventListener('click', () => {
    socket.emit('exit user', uname)
    joinSection.classList.remove('active')
    chatSection.classList.add('active')
})

const exitUser = (name) => {
    const div = document.createElement('div')
    div.classList.add('user-update')
    div.style.backgroundColor = 'red'
    div.style.color = 'white'
    div.textContent = `${name} left this conversation`
    mainDiv.appendChild(div)
}

socket.on('disconnected', (uname) => {
    exitUser(uname)
})