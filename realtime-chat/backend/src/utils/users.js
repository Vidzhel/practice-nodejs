const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        throw {
            message: "Username and room are required!",
        };
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // Validate username
    if (existingUser) {
        throw {
            message: "Username is in use!",
        };
    }

    // Store user
    const user = { id, username, room, typing: false };
    users.push(user);
    return { user };
};

const userIsTyping = (id) => {
    const user = getUser(id);
    user.typing = true;
};

const userIsNotTyping = (id) => {
    const user = getUser(id);
    user.typing = false;
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
};

const getUsersWithNameInRoom = (room, username) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room && user.username === username)[0];
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    userIsTyping,
    userIsNotTyping,
    getUsersWithNameInRoom,
};
