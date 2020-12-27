const MongoClient = require('mongodb').MongoClient;

const config  =  require('../config')

module.exports = {
    getCollection,
    getSqlClient
}

// Postgres
const {Pool,Client} = require('pg')
const connectionString = 'postgressql://postgres:Kahol965@todosdb.cv2fuustqko8.us-east-2.rds.amazonaws.com:5432/todosdb'

async function getSqlClient(){

    const client = new Client({
        connectionString
    })  
    await client.connect()
    return client
}


// MongoDB
const dbName = 'Todos_db';

var dbConn = null;

async function getCollection(collectionName) {
    const db = await connect()
    return db.collection(collectionName);
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(config.dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch(err) {
        console.log('Cannot Connect to DB', err)
        throw err;
    }
}




