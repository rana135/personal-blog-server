require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jg2kbpc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    client.connect();
    const db = client.db("personal-blog");
    const blogCollection = db.collection("blogs");

    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();

      res.send({ status: true, data: blog });
    });

    app.post("/blog", async (req, res) => {
      const blog = req.body;

      const result = await blogCollection.insertOne(blog);

      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/blog/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const blogs = req.body;
      console.log(blogs._id);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
          $set: blogs,
      }
      const result = await blogCollection.updateOne(filter, updateDoc, options)
      res.send(result)
  })

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello From Blog!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
