const mongoose=require('mongoose')

const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ['completed', 'not completed'],
        required: true,
        default: 'not completed', 
    },
})

const task=mongoose.model('Tasks',taskSchema);
module.exports=task;