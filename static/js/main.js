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

const chatUsername = document.querySelector('#chat_name')
const chatLog = document.querySelector('#chat_log')
const chatInput = document.querySelector('#chat_message_input')
const chatSubmit = document.querySelector('#chat_message_submit')

// Functions
function getCookie(name) {
    var cookieValue = null

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))

                break
            }
        }
    }

    return cookieValue
}

async function JoinRoom() {
    chatName = chatUsername.value

    const data  = new FormData()
    data.append('name', chatName)
    data.append('url', chatWindowURL)

    url = `/api/create-room/${chatRoomId}/`

    await fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }, 
        body: data
    })
    .then((res)=> res.json())
    .then((data)=> console.log('data', data))

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomId}/`)

    chatSocket.addEventListener('message', function(e) {
        console.log('Message');
    })

    chatSocket.addEventListener('open', function(e) {
        console.log('WebSocket connection opened');
    })

    chatSocket.addEventListener('close', function(e) {
        console.log('WebSocket connection closed:', e.code, e.reason);
    })


}

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

    JoinRoom()
})


