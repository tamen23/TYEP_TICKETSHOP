import { MongoClient } from 'mongodb';


export async function getEvenement(req, res) {
  const filter = {};

  const client = await MongoClient.connect(
    'mongodb+srv://leotamen22:FxGkjVn5uBpXPsLL@clustertyep.grmvsbh.mongodb.net/?retryWrites=true&w=majority&appName=Clustertyep'
  );

  try {
    const coll = client.db('Tyep').collection('fnacscrap');
    const cursor = coll.find(filter);
    const result = await cursor.toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    await client.close();
  }
}
