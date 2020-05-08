const users = [];

const addUser = ({ id, name }) => {
    name = name.trim().toLowerCase();

    const existingUser = users.find((user) => user.name === name);

    if (existingUser) {
        return { error: 'Username already exists' };
    }

    const user = { id, name };

    users.push(user);

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return user.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

module.exports = { addUser, removeUser, getUser};