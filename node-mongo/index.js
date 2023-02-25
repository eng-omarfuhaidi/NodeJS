const MongoClient =require('mongodb').MongoClient;
const assert= require('assert');

const url ='mongodb://localhost:27017/';

const dbname='data';

MongoClient.connect(url,(err,client)=>{

    assert.equal(err,null);

    console.log('Connected Correctly to Server');

    const db =client.db(dbname);

    const collection = db.collection('dishes');
    collection.insertOne({"name":"Petza","Discription":"Test"},(err,result)=>{

        assert.equal(err,null);

        console.log('After insert:\n');
        console.log(result.ops);
        collection.find({}).toArray((err,docs)=>{
            assert.equal(err,null);
            console.log('Find:\n');
            console.log(docs);


        });

    });
});