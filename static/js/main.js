// Variables
let chatName = ''
let chatSocket = null
let chatWindowURL = window.location.href
let chatRoomId = Math.random().toString(36).slice(2, 12)

// Constants
const chat = document.querySelector('#chat') 
const chatOpen = document.querySelector('#chat_open') 
const chatJoin = document.querySelector('#chat_join') 
const chatIcon = document.querySelector('#chat_icon') 
const chatWelcome = document.querySelector('#chat_welcome') 

const chatRoomElement = document.querySelector('#chat_room') 

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

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInput.value,
        'name': chatName
    }))

    chatInput.value = ''
}

function onChatMessage(data) {
    console.log('onChatMessage', data);

    if (data.type == 'chat_message') {
        if (data.agent) {
            chatLog.innerHTML += `
            <div class="container mt-2 agent-bubble">
                    <div class="row">
                        <div class="col-md-1">
                            <div class="rounded-circle bg-secondary text-center pt-2 initials" style="width: 50px; height: 50px;">
                                ${data.initials}
                            </div>
                        </div>

                        <div class="col-md-6 ml-auto">
                            <div class="p-3 rounded-4" >
                                <p class="text-sm overflow-hidden" style="white-space: normal; word-wrap: break-word;">${data.message}</p>
                            </div>

                            <p class="text-muted">${data.created_at} ago</p>
                        </div>
                    </div>
                </div>
            `
        } else {
            chatLog.innerHTML += `
            <div class="container mt-2 client-bubble">
                <div class="row">
                    <div class="col-md-6 ml-auto">
                        <div class="bg-primary p-3 rounded-4 d-flex justify-content-end">
                            <p class="text-sm overflow-hidden" style="white-space: normal; word-wrap: break-word;">${data.message}</p>
                        </div>

                        <p class="text-muted d-flex justify-content-end">${data.created_at} ago</p>
                    </div>
                    
                    <div class="col-md-1">
                        <div class="rounded-circle bg-secondary text-center pt-2 initials" style="width: 50px; height: 50px;">
                            ${data.initials}
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }

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

    // Get messages from the back end
    chatSocket.addEventListener('message', function(e) {
        console.log('Message');

        onChatMessage(JSON.parse(e.data))
    })

    chatSocket.addEventListener('open', function(e) {
        console.log('WebSocket connection opened');
    })

    chatSocket.addEventListener('close', function(e) {
        console.log('WebSocket connection closed:', e.code, e.reason);
    })
}

// Event listeners
if (chatOpen) {
    chatOpen.addEventListener('click', function(e){
        e.preventDefault()
        chatIcon.classList.add('hidden')
        chatWelcome.classList.remove('hidden')
    })

    chatJoin.addEventListener('click', function(e){
        e.preventDefault()
    
        chatWelcome.classList.add('hidden')
        chatRoomElement.classList.remove('hidden')
    
        JoinRoom()
    })
    
    chatSubmit.addEventListener('click', function(e) {
        e.preventDefault()
        sendMessage()
    })
}


                