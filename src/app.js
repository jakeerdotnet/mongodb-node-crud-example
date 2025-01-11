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
mongoClient.connect(err => {
  if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
  }
})

const db = mongoClient.db('sample_mflix');
const collection = db.collection('users');

app.use(Express.json());

app.get('/', async (request, response) => {
  let result = await getAllPerson(collection)
  response.send(result);
});

// Read (GET) a specific item by ID
app.get('/:person', async (request, response) => {
  let result = await getPerson(collection, JSON.parse(request.params.person))
  response.send(result);
});

// POST method route
app.post('/', async (request, response) => {
  await insertPerson(collection, request.body);
  response.send(request.body);
});

// PUT method route
app.put('/', async (request, response) => {
  await updatePerson(collection, request.body.email, request.body);
  response.send(request.body);
});

// DELETE method route
app.delete('/', async (request, response) => {
  await deletePerson(collection, request.body);
  response.send(request.body);
});

app.get('/random', async (request, response) => {
  try {
    const results = await collection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray();
    response.send(results);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

app.get('/search', async (request, response) => {
  const searchQuery = request.query.q;
  try {
    const results = await collection.aggregate([
      {
        $search: {
          index: 'quotes-search-index',
          text: {
            query: searchQuery,
            path: ['Quote', 'Author'],
            fuzzy: {}
          }
        }
      },
      {
        $limit: 10
      },
      {
        $sort: {
          popularity: -1
        }
      }
    ]).toArray();
    response.send(results);
  } catch (error) {
    response.status(500).send({ message: error.message });
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