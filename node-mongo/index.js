const MongoClient =require('mongodb').MongoClient;
const assert= require('assert');
const dboper=require('./operations');

const url ='mongodb://localhost:27017/';

const dbname='data';

MongoClient.connect(url).then((client)=>{

    console.log('Connected Correctly to Server');

    const db =client.db(dbname);

    dboper.insertDocument(db,{name:"Vadonut",desciption:"Test"},"dishes")
    .then((result)=>{
        console.log('Insert Document :\n',result.ops);
      return  dboper.findDocuments(db,'dishes');
    })
        .then((docs)=>{
            console.log('Found Document :\n' , docs);

            return dboper.updateDocument(db,{name:'Vadonut'},{desciption:'Update Test'},'dishes')
        })
            .then((result)=>{
                console.log('Updated Document ',result.result);

                return dboper.findDocuments(db,'dishes');
            })
                .then((docs)=>{
                console.log('Found Document :\n' , docs);
                return db.dropCollection('dishes');
            })
                .then((result)=>{
                    console.log('Drop collection : ' , result);
                    client.close();
                })
                .catch((err)=> console.log(err));
})
.catch((err)=> console.log(err));