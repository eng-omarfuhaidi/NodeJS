const MongoClient =require('mongodb').MongoClient;
const assert= require('assert');
const dboper=require('./operations');

const url ='mongodb://localhost:27017/';

const dbname='data';

MongoClient.connect(url,(err,client)=>{

    assert.equal(err,null);

    console.log('Connected Correctly to Server');

    const db =client.db(dbname);

    dboper.insertDocument(db,{name:"Vadonut",desciption:'Test'},'dishes',(result)=>{
        console.log('Insert Document :\n',result.ops);
        dboper.findDocuments(db,'dishes',(docs)=>{
            console.log('Found Document :\n' , docs);

            dboper.updateDocument(db,{name:'Vadonut'},{desciption:'Update Test'},'dishes',(result)=>{
                console.log('Updated Document ',result.result);

                dboper.findDocuments(db,'dishes',(docs)=>{
                    console.log('Found Document :\n' , docs);
                db.dropCollection('dishes',(result)=>{
                    console.log('Drop collection : ' , result);
                    client.close();
                });
                });

            });
        });
    });
  
});