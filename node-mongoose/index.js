const mongoose =require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/data';

const connect = mongoose.connect(url);

connect.then((db)=>{
console.log('Connected Correctly to a server');

 Dishes.create({
name:"Delicious Petza",
description:"Testing Petza"
})
.then((dish)=>{
console.log(dish);
return Dishes.findByIdAndUpdate(dish._id,{
    $set:{description:'Update test'}
},
{  
   new :true 
}).exec();
})
.then((dish)=>{
    console.log(dish);

    dish.comments.push({
        rating:5,
        comment:'this is a comment',
        author :'Omar'
    });
    return dish.save();
})
.then((dish)=>{
    console.log(dish);
    return Dishes.deleteMany({});

})
.then(()=>{
    return mongoose.connection.close();
})
.catch((err)=>{
    console.log(err);
});
});