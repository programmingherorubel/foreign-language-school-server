const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdolxqi.mongodb.net/?retryWrites=true&w=majority`;

// middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())





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
    await client.connect();
    console.log('database is runnning......')
    const database = client.db("project12");
    const usersCollection = database.collection("users");
    const courseCollection = database.collection("course");
    const cartCollection = database.collection("selectcourse")


    app.put('/users/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find({}).toArray()
      res.send(result)
    })

    // new course 
    app.post('/newcourse', async (req, res) => {
      const course = req.body
      const result = await courseCollection.insertOne(course)
      res.send(result)
    })

    app.get('/newcourse', async (req, res) => {
      const result = await courseCollection.find({}).toArray()
      res.send(result)
    })

    app.get('/newcourse/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await courseCollection.findOne(query)
      res.send(result)
    })

    app.put('/newcourse/approved/:id', async (req, res) => {
        const id = req.params.id;
        const filterData = { _id: new ObjectId(id)};
        const updateDoc = { $set: { status: "approved" } };
    
        const result = await courseCollection.updateOne(filterData, updateDoc);
        console.log(result)
        res.send(result)
      
    });
    app.put('/newcourse/denied/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const filterData = { _id: new ObjectId(id)};
        const updateDoc = { $set: { status: "denied" } };
    
        const result = await courseCollection.updateOne(filterData, updateDoc);
        console.log(result)
        res.send(result)
      
    });

    // edit course collection 
    app.put('/newcourseupdate/:id',async(req,res)=>{
      const id = req.params.id 
      const data = req.body 
      const query = {_id:new ObjectId(id)}
      const updateDoc = {
        $set:{
          ...data
        }
      }
      const result = await courseCollection.updateOne(query,updateDoc)
      console.log(result)
      res.send(result)
    })
   
    // admin role input 
    app.put('/admin/:email',async(req,res)=>{
      const email = req.params.email
      const filterData  = {email:email}
      const updateDoc = {
        $set:{
          role:"admin"
        }
      } 
      const result = await usersCollection.updateOne(filterData,updateDoc)
      console.log(result)
      res.send(result)
    })
    // instractor role input 
    app.put('/instractor/:email',async(req,res)=>{
      const email = req.params.email
      const filterData  = {email:email}
      const updateDoc = {
        $set:{
          role:"instractor"
        }
      } 
      const result = await usersCollection.updateOne(filterData,updateDoc)
      console.log(result)
      res.send(result)
    })

  //  admin feedback 
  app.put('/feedback/:id',async(req,res)=>{
    const id = req.params.id 
    const info = req.body
    const filter = {_id:new ObjectId(id)}
    const updateDoc={
      $set:{
        feedback:info,
      }
    } 
    const result = await courseCollection.updateOne(filter,updateDoc)
    console.log(result)
    res.send(result)
  }) 
  
  // spacific instractor class 
app.get('/myclass/:email',async(req,res)=>{
  const email = req.params.email 
  const query = {departmentEmail:email}
  const result = await courseCollection.find(query).toArray()
  res.send(result)
})


// Edit course 
app.get('/editcourse/:id',async(req,res)=>{
  const id = req.params.id 
  const query = {_id: new ObjectId(id)}
  const result = await courseCollection.findOne(query)
  res.send(result)
})

// add to cart
app.post('/addtocart',async(req,res)=>{
    const selectCourse = req.body 
    const result = await cartCollection.insertOne(selectCourse)
    console.log(result)
    res.send(result)
})
app.get('/addtocart',async(req,res)=>{
    const result = await cartCollection.find({}).toArray()
    res.send(result)
})



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('project 12 running.....!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})