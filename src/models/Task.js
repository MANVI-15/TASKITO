//DATABASE MODEL FOR TASK DATABASE

const mongoose=require('mongoose');

//TASK MODEL DESCRIPTION AND ( DATA VALIDATION ANND DATA SANITIZATION IMLEMENTATION) CHECKS

const TaskSchema=new mongoose.Schema({
  
  
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:
    {
        type:Boolean,
        default:false
    },
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        /*Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). 
        We may populate a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query. 
        Let's look at some examples.Populated paths are no longer set to their original _id , their value is replaced with the mongoose 
        document returned from the database by performing a separate query before returning the results.*/
        ref:'User'
    }
},{
    timestamps: true
})


const Task=mongoose.model('Task', TaskSchema)


module.exports=Task;