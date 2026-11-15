
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("hireloop");
console.log(client)

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/user" , async (req, res) => {
   
    const collection = db.collection("user");
    const data = await collection.find().toArray();
    res.send(data)
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});