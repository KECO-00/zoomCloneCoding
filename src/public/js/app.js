const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

// app.js에서의 socket은 서버로의 연결을 의미
const socket = new WebSocket(`ws://${window.location.host}`);

//서버랑 연결되었을 때 
socket.addEventListener("open", () =>{
    console.log("Connected to Server ✅");
});

//서버에게 메시지를 받았을 때
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

//서버와 연결이 끊어졌을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

// setTimeout(() => {
//     socket.send("Hello from the browser!");
// }, 5000);

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    // console.log(input.value);
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";

}

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);