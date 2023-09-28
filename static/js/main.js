// Variables
let chatName = ''
let chatSocket = null
let chatWindowURL = window.location.href
let chatRoomId = Math.random().toString(36).slice(2, 12)

console.log(chatRoomId);

// Constants
const chat = document.querySelector('#chat') 
const chatOpen = document.querySelector('#chat_open') 
const chatJoin = document.querySelector('#chat_join') 
const chatIcon = document.querySelector('#chat_icon') 
const chatWelcome = document.querySelector('#chat_welcome') 
const chatRoom = document.querySelector('#chat_room') 

// Event listeners
chatOpen.addEventListener('click', function(e){
    e.preventDefault()
    chatIcon.classList.add('hidden')
    chatWelcome.classList.remove('hidden')
})

chatJoin.addEventListener('click', function(e){
    e.preventDefault()

    chatWelcome.classList.add('hidden')
    chatRoom.classList.remove('hidden')
})


