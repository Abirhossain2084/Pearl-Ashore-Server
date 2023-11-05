const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());


// Store the cart items in an array
const cart = [];



//mongo connection start///

user = process.env.DB_USER
pass = process.env.DB_PASS

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${user}:${pass}@cluster0.imav3gf.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const cartCollection = client.db('productDB').collection('cartproduct')



    //post or add data to mdb
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })


    //get those data from   mdb
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })


    // Get All product by name
    app.get('/product/:name', async (req, res) => {
      const name = req.params.name;
      const query = { name: { $regex: new RegExp(name, 'i') } }// Query by the product's name
      const results = await productCollection.find(query).toArray();
      res.send(results);
    });



    // Get All product id and update
    app.get('/product/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }// Query by the product's name
      const result = await productCollection.findOne(query);
      res.send(result);
    });

// Update a product by ID
app.put('/product/id/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }; // Query by the product's ID
  const options = { upsert: true };
  
  // Construct an update object with $set
  const updateObject = {
    $set: {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      description: req.body.description,
      rating: req.body.rating,
      photo: req.body.photo,
    }
  };

  const result = await productCollection.updateOne(filter, updateObject, options);
  res.send(result);
  console.log(result);
});


// add add-to-cart data

app.post('/cartproduct/add-to-cart', async (req, res) => {
  const cartproduct = req.body;
  console.log(cartproduct);
  const result = await cartCollection.insertOne(cartproduct);
  res.send(result);
  console.log('hitting');
})

 //get those cart data from   mdb
 app.get('/cartproduct/add-to-cart', async (req, res) => {
  const cursor = cartCollection.find();
  const result = await cursor.toArray();
  res.send(result);

})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//mongo connection end///



app.get('/', (req, res) => {
  res.send('running')
})

app.listen(port, () => {
  console.log(`running port : ${port}`);
})
