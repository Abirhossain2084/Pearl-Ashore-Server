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

    
    const roomCollection = client.db('Pearl_Ashore').collection('roomdata')
    const bookingCollection = client.db('Pearl_Ashore').collection('bookingdata')
    const reviewCollection = client.db('Pearl_Ashore').collection('reviewdata')


    //get rooms data from   mdb
    app.get('/rooms', async (req, res) => {
      const cursor = roomCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
   //get rooms data by id from   mdb
    app.get('/rooms/:id', async (req, res) => {
      const roomId = req.params.id;
      try {
        const room = await roomCollection.findOne({ _id: new ObjectId(roomId) });
        if (!room) {
          // If room is not found, return a 404 status
          return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // booking data add to server side

    app.post('/bookings' ,async(req,res) =>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking)
      res.send(result);
    })

    //get specific data by 

    app.get('/bookings',async(req,res)=>{
      console.log(req.query);

      let query = {};

      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })


    
//get specific data by id
    app.get('/bookings/:id',async(req,res)=>{
      const bookingId = req.params.id;
  try {
    const bookById = await bookingCollection.findOne({ _id: new ObjectId(bookingId) });
    if (!bookById) {
      // If room is not found, return a 404 status
      return res.status(404).json({ error: 'revie not found' });
    }
    res.json(bookById);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
    })



  // delete specific data

    app.delete('/bookings/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })




// Update booking route
app.put('/bookings/:id', async(req, res) => {

  const id = req.params.id;
  console.log(req.params.date);
  const filter = {_id: new ObjectId(id)};
  const options ={ upsert:true};
  const updatedDtae =req.body;
  console.log(updatedDtae);
  const date ={
    $set:{
      date:updatedDtae.date,
    }
  };

  await bookingCollection.updateOne(filter, date, options, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating booking');
    } else {
      res.send(result);
    }
  });
});


// insert review data 


 // booking data add to server side

 app.post('/reviews' ,async(req,res) =>{
  const review = req.body;
  console.log(review);
  const result = await reviewCollection.insertOne(review)
  res.send(result);


})
 // booking data get from server side

 app.get('/reviews' ,async(req,res) =>{
  const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
})

//get rooms data by id from   mdb
app.get('/reviews/:id', async (req, res) => {
  const reviewid = req.params.id;
  try {
    const review = await reviewCollection.findOne({ _id: new ObjectId(reviewid) });
    if (!review) {
      // If room is not found, return a 404 status
      return res.status(404).json({ error: 'revie not found' });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

    

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
