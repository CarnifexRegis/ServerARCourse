const express = require('express')
const app = express()
const path = require('path');
const port = 3535;
const url = "mongodb://localhost:27017/"; //still needs fixing
const collectionName = "anchors";


var mongoClient = require('mongodb').MongoClient;
app.use(express.json());
app.use(express.static('./client'));


//get front page
app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/client/index.html'));
})


/**
 * DB INITIALISATION
 */

mongoClient.connect(url, async function (err, db) {
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
    //gets an anchor by key?
    app.get('/anchor', async (req, res) => {
        try {

            let query = req.body;
            if (!query.hasOwnProperty('key')) {
                return res.status(400).send('Bad request');
            }

            let key = query.key;
            const anchor = await anchors.findOne({ key }); // still don't know exactly functions this should return the anchor json

            return res.status(200).send(anchor);



        } catch (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

    });


    //post a new anchor
    app.post('/anchor', async (req, res) => {
        try {

            let query = req.query;
            if (!query.hasOwnProperty('anchor')) {
                return res.status(400).send('Bad request');
            }

            let newAnchor = query.anchor;
            const result = await anchors.insertOne(newAnchor);

            console.log('New anchor was inserted with result ' + result);




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



app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
