// Variables
const chatRoom = document.querySelector('#room_room_id').textContent.replaceAll('"', '')
const userName = document.querySelector('#user_name').textContent.replaceAll('"', '')
const agent = document.querySelector('#user_id').textContent.replaceAll('"', '')
let chatSocket = null

// Elements
const chatLog = document.querySelector('#chat_log')
const chatInput = document.querySelector('#chat_message_input')
const chatSubmit = document.querySelector('#chat_message_submit')

// Functions
function scrollToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight
}

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInput.value,
        'name': userName,
        'agent': agent,
    }))

    chatInput.value = ''
}

function onChatMessage(data) {
    console.log('onChatMessage', data);

    if (data.type == 'chat_message') {
        let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }

        if (!data.agent) {
            chatLog.innerHTML += `
            <div class="container mt-2 agent-bubble">
                    <div class="row">
                        <div class="col-md-1">
                            <div class="text-white rounded-circle bg-secondary text-center pt-2 initials" style="width: 50px; height: 50px;">
                                ${data.initials}
                            </div>
                        </div>

                        <div class="col-md-6 ml-auto">
                            <div class="p-3 rounded-4" >
                                <p class="text-white text-sm overflow-hidden" style="white-space: normal; word-wrap: break-word;">${data.message}</p>
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
                            <p class="text-white text-sm overflow-hidden" style="white-space: normal; word-wrap: break-word;">${data.message}</p>
                        </div>

                        <p class="text-muted d-flex justify-content-end">${data.created_at} ago</p>
                    </div>
                    
                    <div class="col-md-1">
                        <div class="text-white rounded-circle bg-secondary text-center pt-2 initials" style="width: 50px; height: 50px;">
                            ${data.initials}
                        </div>
                    </div>
                </div>
            </div>
            `
        } 
    } else if (data.type == 'writing_active') {
        if (!data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }

            chatLog.innerHTML += `
            <div class="container mt-2 agent-bubble">
                    <div class="tmp-info row">
                        <div class="col-md-1">
                            <div class="text-white rounded-circle bg-secondary text-center pt-2 initials" style="width: 50px; height: 50px;">
                                ${data.initials}
                            </div>
                        </div>

                        <div class="col-md-6 ml-auto">
                            <div class="p-3 rounded-4" >
                                <p class="text-white text-sm overflow-hidden" style="white-space: normal; word-wrap: break-word;">${data.name} is typing...</p>
                            </div>

                        </div>
                    </div>
                </div>
            `
        }
    }
    scrollToBottom()
}

// Websocket
chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)

chatSocket.addEventListener('message', function(e) {
    console.log('Message');
    
    onChatMessage(JSON.parse(e.data))
})

chatSocket.addEventListener('open', function(e) {
    console.log('WebSocket connection opened');
    scrollToBottom()
})

chatSocket.addEventListener('close', function(e) {
    console.log('WebSocket connection closed:', e.code, e.reason);
})

// Event Listeners
chatSubmit.addEventListener('click', function(e) {
    e.preventDefault()
    sendMessage()
})

chatInput.addEventListener('keyup', function(e){
    if (e.keyCode == 13) {
        sendMessage()
    }
})

chatInput.addEventListener('focus', function(e){
    chatSocket.send(JSON.stringify({
        'type': 'update',
        'message': 'writing_active',
        'name': userName,
        'agent': agent,
    }))
})