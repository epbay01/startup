const MongoClient = require("mongodb");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const url = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.hostname}`
const client = new MongoClient(url);
const db = client.db('startup');
const collection = db.collection('user data');

// makeUser(username, password) creates a new user with the given username and password
// updateUser(user) updates the user in the database
// getUser(username) returns the user with the username
// deleteUser(user) deletes the user

async function makeUser(username, password) {
    const passHash = await bcrypt.hash(password, 10);
    const user = {
        username: username,
        password: passHash,
        currentStreak: 0,
        highestStreak: 0,
        popVote: 0,
        unpopVote: 0,
        confirmVotes: false,
        notifications: true,
        votedToday: false,
        userHistory: {},
        token: uuid.v4()
    };
    collection.insertOne(user);
    return user;
}

async function updateUser(user) {
    collection.updateOne({username: user.username}, user);
}

async function getUser(username) {
    return await collection.findOne({username: username});
}

async function deleteUser(user) {
    collection.delete({username: user.username});
}

module.exports = {
    makeUser, updateUser, getUser, deleteUser
}