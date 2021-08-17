const cron=require('node-cron');
const User=require('../models/User')
const Task=require('../models/Task');
const { sendmail } = require('./account');



const solve=async (user)=>{

    const incomplete= await Task.find({owner:user._id,completed:false});

    incomplete.forEach((item,index,incomplete)=>{
        const k=item.toObject();
        incomplete[index]=k.description;

     })

     if(incomplete.length===0)
     {
           return ;
     }
       sendmail(user.email,incomplete);
}

//00 00 12 * * 0-6
cron.schedule('* * * * *', async() => {
     
    const user=await User.find({});
    user.forEach((item)=>{
        solve(item);
     })
    
    
    },{
   scheduled: true,
   timezone: 'Asia/Kolkata'
});

