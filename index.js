const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmxrrle.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const carCollection = client.db("carDB").collection("car");

        app.get("/getCar", async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/getBrand/:brand_name", async (req, res) => {
            const brandName = req.params.brand_name;
            const cursor = carCollection.find({ brand_name: brandName });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/getProduct/:product_name", async (req, res) => {
            const productName = req.params.product_name;
            const cursor = carCollection.find({ name: productName });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.put("/UpdateProduct/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const upddatedProduct = req.body;
            const product = {
                $set: {
                    img_url: upddatedProduct.img_url,
                    name: upddatedProduct.name,
                    brand_name: upddatedProduct.brand_name,
                    type: upddatedProduct.type,
                    price: upddatedProduct.price,
                    desc: upddatedProduct.desc,
                    rating: upddatedProduct.rating,
                },
            };

            const result = await carCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });

        app.post("/addCar", async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (res, req) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});
