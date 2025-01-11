import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import Express from 'express';
import cors from 'cors';
import { getAllPerson, insertPerson, deletePerson, updatePerson, getPerson } from './peopleCrud.js';

const app = Express();

// Use CORS middleware
app.use(cors());
app.options('*', cors())

dotenv.config();

const uri = process.env.DB_URI;
const mongoClient = new MongoClient(uri, { serverApi: ServerApiVersion.v1, useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoClient.db('Walkathon');
const collection = db.collection('People');

app.use(Express.json());

app.get('/', async (request, response) => {
  try {
    await mongoClient.connect();
    const results = await collection.find().toArray();
    response.send(results);
  } catch (error) { 
    response.status(500).send({ message: error.message });
  } finally {
    await mongoClient.close();
  }
});

// Read (GET) a specific item by ID
app.get('/:person', async (request, response) => {
  try {
    await mongoClient.connect();
    const result = await collection.find(JSON.parse(request.params.person)).toArray();
    response.send(result);
  } catch (error) { 
    response.status(500).send({ message: error.message });
  } finally { 
    await mongoClient.close();
  }
});

// POST method route
app.post('/', async (request, response) => {
  try {
    await mongoClient.connect();
    await insertPerson(collection, request.body);
    response.send(request.body);
  } catch (error) { 
    response.status(500).send({ message: error.message })
  } finally {
    await mongoClient.close();  
  }
});

// PUT method route
app.put('/', async (request, response) => {
  try {
    await mongoClient.connect();
    await updatePerson(collection, request.body.email, request.body);
    response.send(request.body);
  } catch (error) {
    response.status(500).send({ message: error.message });
  } finally {
    await mongoClient.close();
  }
});

// DELETE method route
app.delete('/', async (request, response) => {
  try {
    await mongoClient.connect();
    await deletePerson(collection, request.body);
    response.send(request.body);
  } catch (error) {
    response.status(500).send({ message: error.message });
  } finally {
    await mongoClient.close();
  }
});


app.listen(3000, async () => {
  try {
    await mongoClient.connect();
    console.log('Listening on port 3000');
  } catch (error) {
    console.error(error);
  }
});