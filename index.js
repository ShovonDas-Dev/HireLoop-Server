
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express()


app.use(cors())
app.use(express.json())

const port = 5000;

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("hireloop");
const jobsCollection = db.collection("jobsCollection")

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

app.post("/jobs", async (req, res) => {
  try {
    const data = req.body

    const result = await jobsCollection.insertOne(data)

    res.status(201).send({
      success: true,
      message: "Job created successfully",
      insertedId: result.insertedId,
    })
  } catch (error) {
    console.error("Job creation error:", error)

    res.status(500).send({
      success: false,
      message: "Failed to create job",
    })
  }
})

app.get('/jobs', async (req,res) => {
  const collection= db.collection("jobsCollection")
  const data = await collection.find().toArray();
  res.send(data)
})
app.delete('/jobs/:id' , async (req,res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobsCollection.deleteOne(query)
    res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});