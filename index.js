const express = require("express");
const mongodb = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const port = 8000;

const DBURL = process.env.DATABASE_NAME;

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const client = await mongoClient.connect(DBURL);
    const db = client.db("demo_node_users");
    const doc = await db.collection("user").find().toArray();
    res.status(200).send(doc);
    client.close();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/get-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await mongoClient.connect(DBURL);
    const db = client.db("demo_node_users");
    const doc = await db.collection("user").findOne({ _id: objectId(id) });
    res.status(200).send(doc);
    client.close();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/insert-user", async (req, res) => {
  try {
    const { username, email } = req.body;
    const client = await mongoClient.connect(DBURL);
    const db = client.db("demo_node_users");
    const doc = await db.collection("user").insertOne({ username, email });
    res.status(200).json({ message: "the data is inserted", doc });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put("/update-username", async (req, res) => {
  try {
    const { username, email } = req.body;
    const client = await mongoClient.connect(DBURL);
    const db = client.db("demo_node_users");
    const user = await db.collection("user").findOne({ email });
    if (user) {
      await db
        .collection("user")
        .findOneAndUpdate({ email }, { $set: { username } });
      res.status(200).json({ message: "username is updated successfully!" });
    } else {
      res.status(404).send("user doesn't exists!");
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/delete-user", async (req, res) => {
  try {
    const { id } = req.body;
    const client = await mongoClient.connect(DBURL);
    const db = client.db("demo_node_users");
    await db.collection("user").findOneAndDelete({ _id: objectId(id) });
    res.status(200).json({ message: "user is deleted successfully" });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`::: server is 🚀 on http://localhost:${port} :::`);
});
