import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.NEXT_PUBLIC_uri || "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const myDB = await client.db("admin");
    const myColl = myDB.collection("contact");
    return myColl;
  } catch (error) {
    throw `No connect error:\n ${error}`;
  }
}
