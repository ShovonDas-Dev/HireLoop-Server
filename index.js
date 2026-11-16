
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


app.get('/jobs', async (req, res) => {
  try {
    const query = {};

    console.log("query:", req.query);

    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.location) {
      query.location = {
        $regex: req.query.location,
        $options: "i"
      };
    }

    if (req.query.isRemote !== undefined) {
      query.isRemote = req.query.isRemote === "true";
    }

    if (req.query.search) {
      query.$or = [
        { jobTitle: { $regex: req.query.search, $options: "i" } },
        { companyName: { $regex: req.query.search, $options: "i" } },
        { responsibilities: { $regex: req.query.search, $options: "i" } },
        { requirements: { $regex: req.query.search, $options: "i" } }
      ];
    }

    if (req.query.frequency) {
      query.frequency = req.query.frequency;
    }

    const data = await jobsCollection.find(query).toArray();

    res.send(data);

  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
});



app.delete('/jobs/:id' , async (req,res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobsCollection.deleteOne(query)
    res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});