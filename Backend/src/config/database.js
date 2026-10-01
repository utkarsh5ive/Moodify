const mongoose = require('mongoose')


function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected To Mongo DB.")
    })
    .catch(error =>{
        console.log("Error connecting to DB.");
    })
}

module.exports = connectToDB