const path = require("path");
const express = require("express");
const app = express();
const { addUser, getUser, getUsersInRoom, removeUser } = require("./utils/users");
const { generateLocationMessage, generateMessage } = require("./utils/messages");

app.use(express.static(path.join(__dirname, "../public")));

const server = app.listen("8080", () => {
    console.log("Started server!");
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
    socket.on("join", ({ username, room }, callback) => {
        try {
            addUser({ username, room, id: socket.id });
            socket.join(room);
            socket
                .to(room)
                .emit("message", generateMessage("Admin", `${username} jointed the room`));
            socket.emit("message", generateMessage("Admin", `Nice to meet you, ${username}`));

            updateRoomInfo(room, username);
            callback(null);
        } catch (e) {
            callback(e.message);
        }
    });
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        if (user) {
            socket.to(user.room).emit("message", generateMessage(user.username, message));
            callback(null);
        } else {
            callback("Invalid user");
        }
    });
    socket.on("disconnect", () => {
        const user = getUser(socket.id);
        if (user) {
            const { username, room } = user;
            removeUser(socket.id);

            socket.leave(room);
            io.to(room).emit("message", generateMessage("Admin", `${username} left the room`));

            updateRoomInfo(room, username);
        }
    });

    function updateRoomInfo(room, username) {
        const roomInfo = { users: getUsersInRoom(room), room, currentUser: username };
        io.to(room).emit("roomData", roomInfo);
    }
});
