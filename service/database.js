import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import dbConfig from "./dbConfig.json" assert { type: "json" };
import { dailyReset } from './index.js';

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
    await dailyReset();
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
    let voteObj = await db.collection('today votes').findOne({"_id": ObjectId(voteDataID)});
    //let voteObj = await db.collection('today votes').findOne({});
    console.log("voteObj in db:" + JSON.stringify(voteObj));
    if (voteObj[vote] == undefined || voteObj[vote] == null) {
        voteObj[vote] = 0;
    }
    voteObj[vote]++;
    await db.collection('today votes').updateOne({"_id": ObjectId(voteDataID)}, { $set: voteObj });
    return voteObj;
}

export async function clearVotes(question) {
    let voteObj = await db.collection('today votes').findOne({"_id": ObjectId(voteDataID)});
    let dateString = new Date().getMonth() + "." + new Date().getDate() + "." + new Date().getFullYear();
    let temp = { [dateString]: voteObj };
    delete temp[dateString]._id;
    db.collection("vote history").insertOne(temp);
    Object.keys(voteObj).forEach(async (key) => { // clear all votes
        if (key != "_id") {
            await db.collection('today votes').updateOne({"_id": ObjectId(voteDataID)}, { $unset: { [key]: "" } });
        }
    });
    question.answers.forEach(async (key) => { // set keys to answer: 0
        await db.collection('today votes').updateOne({"_id": ObjectId(voteDataID)}, { $set: { [key]: 0 } });
        voteObj[key] = 0;
    });
    return voteObj;
}

export async function getVotesForQuestion(question) {
    let voteObj = await db.collection('today votes').findOne({});
    let voteReturnObj = new Object();
    question.answers.forEach(answer => {
        if (voteObj[answer] == undefined || voteObj[answer] == null) {
            voteReturnObj[answer] = 0;
        } else {
            voteReturnObj[answer] = voteObj[answer];
        }
    });
    return voteReturnObj;
}

export async function getVoteHistory(date = "all") {
    if (date == "all") {
        return await db.collection("vote history").find().toArray();
    } else {
        return await db.collection("vote history").findOne({ [date]: { $exists: true } });
    }
}