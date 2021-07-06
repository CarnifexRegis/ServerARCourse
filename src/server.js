const express = require('express')
const app = express()
const path = require('path');
const port = 3535;
//const url = "mongodb://localhost:27017/"; //still needs fixing
const collectionName = "anchors";


var mongoClient = require('mongodb').MongoClient;
app.use(express.json());
app.use(express.static(__dirname + '/client')); //evedbuser pwd231


const uri = "mongodb+srv://evedbuser:pwd231@cluster0.b3kt7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//get front page
app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/client/index.html'));
})


/**
 * DB INITIALISATION
 */

 client.connect(async function (err, db) {
    if (err) throw err;
    console.log("Database created!");


    //we use this for db requests
    const dbo = db.db("guideDB");

    if (!collectionExists(dbo)) {
        let { err, res } = await dbo.createCollection("anchors");
        if (err) throw err;
    }

    const anchors = dbo.collection(collectionName);

    //all requests here
    //gets an anchor by id or by name
    app.get('/anchor', async (req, res) => {
        try {

            let query = req.query;
            console.log(query);
            let searchVar = (query.id) || (query.name) || null; //this should get
            if (!searchVar) {
                return res.status(400).send('Bad request');
            }
            return anchors.findOne(query) // still don't know exactly functions this should return the anchor json
                .then(anchor => {
                    console.log('anchor found is ' + anchor);
                    return res.status(200).send(anchor);
                })
                .catch(err => {
                    console.error(`Failed to find anchor: ${err}`);
                    return res.status(500).send('Server error');
                });

        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

    });


    //gets all anchors
    // query can contain {mapping : true} to return all anchors set as a dictionary of 
    app.get('/anchor/all', async (req, res) => {
        try {

            let query = req.query;
            //TODO : Add option to return dicitonary {name : id};
            return anchors.find()
            .toArray()
            .then(async anchors =>  {
                let output;
                if (query.mapping){
                    output = await mapAnchors(anchors);
                } else {
                    output = anchors
                }
                return res.status(200).send(output);
            })
            .catch(err => {
                console.error(`Failed to get all anchors: ${err}`);
                return res.status(500).send('Server error');
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

    });


    //post a new anchor
    app.post('/anchor', async (req, res) => {
        try {

            let query = req.body;
            console.log(query);
            if (!query.hasOwnProperty('name')) {
                return res.status(400).send('Bad request');
            }

            const result = await anchors.insertOne(query);

            console.log('New anchor was inserted with result ' + result);

            if (result) 
                return res.status(200).send('success');
            else
                return res.status(500).send('failure');

        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

    });

    //we try to detect shutting down and close client ocnnection
    process.on('exit', function () {
        console.log('About to exit.');
        db.close();
    });
});

/*
 * 
 * @param {{
 *  "id": 3,
    "name": "dorm",
    "anchor": {
        "name": "Entry",
        "id": "4b7d1d91-3805-42a9-9be1-2b3fec9e6dad",
        "text": "",
        "children": [
            {
                "name": "Door",
                "id": "",
                "text": "",
                "children": []
            }
        ]
    }
}} anchors 
 */
async function mapAnchors(anchors){
    console.log(anchors);
    if (!anchors){
        return null;
    }


    let output = {};
    for(var i = 0; i<anchors.length; i++){
        let anchor = anchors[i].anchor || null;

        if (!anchor)
            continue;

        output[anchor.name] = anchor.id;
    }

    return output;
     
}
/**
 * Checks if the collection anchors exists
 */
async function collectionExists(dbo) {
    let result = false;
    let { err, collections } = dbo.listCollections().toArray();
    if (err) throw err;

    if (!collections) {
        return;
    }


    for (var i = 0; i < collections.length; i++) {
        if ((collections[i].name).localeCompare(collectionName) === 0) {
            console.log((collections[i].name).localeCompare(collectionName));
            result = true;
            return;
        }
    }
    return result;

}



app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));
