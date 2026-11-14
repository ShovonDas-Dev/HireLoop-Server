import express from 'express';

const app = express();
const port = 5000;

const client = new MongoClient("")

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});