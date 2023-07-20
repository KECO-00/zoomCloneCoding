import http from "http";
import {WebSocketServer} from "ws";
import express from "express";
import path from 'path';

const __dirname = path.resolve();

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 시작 방식
// app.listen(3000, handleListen);

// ws 적용 방식
const server = http.createServer(app);
const wss = new WebSocketServer({server});

//fake database
const sockets = [];

//server.js에서의 socket은 연결된 브라우저를 의미
wss.on("connection", (socket) => {
    // console.log(socket);
    sockets.push(socket);
    console.log("Connected to Browser ✔");
    socket.on("close", () => console.log("Disconnected from Browser ❌"))
    socket.on("message", (message) => {
        sockets.forEach(aSocket => aSocket.send(message.toString()));
        // console.log(message.toString());
        // socket.send(message.toString());
    });
    // socket.send("Hello!");
});

server.listen(3000, handleListen);
