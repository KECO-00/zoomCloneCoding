import http from "http";
// import {WebSocketServer} from "ws";
import {Server} from "socket.io";
import express from "express";
import path from 'path';
// import { instrument } from "@socket.io/admin-ui";

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
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
});

httpServer.listen(3000, handleListen);
