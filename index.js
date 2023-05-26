const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require("dotenv").config();
const port = process.env.PORT || 3000


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ccinbrr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const db = client.db("toyProtal");
    const toyCollection = db.collection("toys");


    app.get("/search/:text", async (req, res) => {
      const searchNameText = req.params.text;

      const result = await toyCollection.find({ name: searchNameText }).toArray();

      res.send(result)
    })


    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(quary);
      res.send(result)
    })
    app.get("/alltoys", async (req, res) => {
      const result = await toyCollection.find({}).limit(20).toArray();
      res.send(result)
    })

    app.post("/postToy", async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body)
      res.send(result)
    })

    app.get("/mytoys/:email", async (req, res) => {
      const result = await toyCollection.find({ selleremail: req.params.email }).toArray();
      res.send(result)
    })

    app.get("/mytoy/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }
      const toy = await toyCollection.findOne(quary);
      res.send(toy);
    })
    


    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateToy = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updateDoc = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.details

        }
      }
      const result = await toyCollection.updateOne(filter, updateDoc, option);
      res.send(result)

    })
    

    app.get("/sort", async(req, res)=>
    {
      const cursor = await toyCollection.find().sort({price : -1}).toArray();
      res.send(cursor)
    })







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is ready')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})