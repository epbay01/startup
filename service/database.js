import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import dbConfig from "./dbConfig.json" assert { type: "json" };

const url = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.hostname}`
const client = new MongoClient(url, { tls: true, serverSelectionTimeoutMS: 3000 });
const db = client.db('startup');
const collection = db.collection('user data');
let voteDataID = "";

// makeUser(username, password) creates a new user with the given username and password
// updateUser(user) updates the user in the database
// getUser(username) returns the user with the username
// deleteUser(user) deletes the user
// getVotes() returns today's vote object

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
}).then(async () => {
    let temp = await db.collection('today votes').findOne({});
    voteDataID = temp._id.toString();
    console.log("Connected to database, voteDataID is " + voteDataID);
});

export async function makeUser(username, password) {
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

export async function updateUser(user) {
    collection.updateOne({ username: user.username }, { $set: {
        password: user.password,
        currentStreak: user.currentStreak,
        highestStreak: user.highestStreak,
        popVote: user.popVote,
        unpopVote: user.unpopVote,
        confirmVotes: user.confirmVotes,
        notifications: user.notifications,
        votedToday: user.votedToday,
        userHistory: user.userHistory,
        token: user.token
    } });
}

export async function getUser(username) {
    return await collection.findOne({username: username});
}

export async function getUserByToken(token) {
    return await collection.findOne({token: token});
}

export async function getAllUsers() {
    return await collection.find().toArray();
}

export async function deleteUser(user) {
    collection.delete({username: user.username});
}

export async function handleVote(vote) {
    let voteObj = await db.collection('today votes').findOne({_id: voteDataID});
    if (voteObj[vote] == undefined || voteObj[vote] == null) {
        voteObj[vote] = 0;
    }
    voteObj[vote]++;
    return voteObj;
}

export async function clearVotes() {
    let voteObj = await db.collection('today votes').findOne({_id: voteDataID});
    Object.keys(voteObj).forEach(key => {
        if (key != "_id") {
            delete voteObj[key];
        }
    });
    await db.collection('today votes').updateOne(
        { _id: voteDataID },
        { $set: voteObj }
    );
    return voteObj;
}