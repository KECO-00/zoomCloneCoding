import http from "http";
// import {WebSocketServer} from "ws";
import {Server} from "socket.io";
import express from "express";
import path from 'path';
import { instrument } from "@socket.io/admin-ui";

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
const wsServer = new Server(httpServer, {
    cors:{
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});
instrument(wsServer, {
    auth: false,
});

function publicRooms(){
    const {
        sockets : 
        {adapter: {sids, rooms},
    },
    } = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("New_message", (msg, room, done) => {
        socket.to(room).emit("New_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);
});

// const wss = new WebSocketServer({server});

// //fake database
// const sockets = [];

// //server.js에서의 socket은 연결된 브라우저를 의미
// wss.on("connection", (socket) => {
//     // console.log(socket);
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ✔");
//     socket.on("close", () => console.log("Disconnected from Browser ❌"))
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);

//         switch(message.type){
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
        
//         // console.log(message.toString());
//         // socket.send(message.toString());
//     });
//     // socket.send("Hello!");
// });

httpServer.listen(3000, handleListen);
