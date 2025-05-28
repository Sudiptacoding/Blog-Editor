const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.5xkla17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("blogeditor");
    const blog = db.collection("blogs");

    app.get("/api/blogs", async (req, res) => {
      const blogs = await blog.find().toArray();
      res.json(blogs);
    });

    app.post("/api/blogs/savedraft", async (req, res) => {
      const { title, content, tags } = req.body;
      console.log(req.body);
      await blog.insertOne({
        title,
        content,
        tags,
        status: "draft",
        created_at: new Date(),
        updated_at: new Date(),
      });
      res.sendStatus(200);
    });

    app.post("/api/blogs/publish", async (req, res) => {
      const { title, content, tags } = req.body;
      await blog.insertOne({
        title,
        content,
        tags,
        status: "published",
        created_at: new Date(),
        updated_at: new Date(),
      });
      res.sendStatus(200);
    });

    app.post("/api/blogsUpdate/:id", async (req, res) => {
      try {
        const blogId = req.params.id;
        const result = await blog.updateOne(
          { _id: new ObjectId(blogId) },
          { $set: { status: "published", updated_at: new Date() } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog status updated to published" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.delete("/api/blogs/:id", async (req, res) => {
      try {
        const blogId = req.params.id;
        const result = await blog.deleteOne({ _id: new ObjectId(blogId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/api/blogs/:id", async (req, res) => {
      const blog = await blog.findOne({ _id: new ObjectId(req.params.id) });
      res.json(blog);
    });

    // Example route
    app.get("/data", async (req, res) => {
      const data = await blog.find().toArray();
      res.send(data);
    });

    app.get("/", async (req, res) => {
      res.send("Welcome to side");
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
