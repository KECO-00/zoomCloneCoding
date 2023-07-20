const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

// app.js에서의 socket은 서버로의 연결을 의미
const socket = new WebSocket(`ws://${window.location.host}`);

//서버랑 연결되었을 때 
socket.addEventListener("open", () =>{
    console.log("Connected to Server ✔");
});

//서버에게 메시지를 받았을 때
socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
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
    socket.send(input.value);
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);