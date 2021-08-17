const express=require('express');
require('./db/mongoose');
const userRoute = require('./routers/users.js');
const taskRoute=require('./routers/task.js')
require('../src/emails/schedule')

const app=express();
const port=process.env.PORT||3000



//middleware function that will run between
// app.use((req,res,next)=>{
   
//      res.status(503).send("Under maintenance");

// })

//TO PARSE THE JSON DATA RECEIVED FROM CLIENT SIDE
app.use(express.json());
app.use(userRoute);
app.use(taskRoute)



app.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})



// const Task=require('./models/Task.js');


// const main=async()=>{
//     // const task = await Task.findById('610010940082d23b14d20a1c');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);

//     const user=await User.findById('6100170df472f6299c49905d');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);

// }

// main();
