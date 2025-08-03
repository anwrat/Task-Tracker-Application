const mongoose = require('mongoose');

const connectdb=async()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
        console.log(connectionInstance.connection.host)
    } catch(err){
        console.log(err)
    }
}

module.exports = connectdb;