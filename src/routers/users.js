const express=require('express');
const router=new express.Router();
const User=require('../models/User')
const auth=require('../middlewares/auth.js')
const multer=require('multer');
const sharp=require('sharp');
const {sendWelcomeemail,sendCancellationemail}=require('../emails/account');

/***************************LOGOUT ***************************/

router.post('/users/logout',auth,async(req,res)=>{

    try
    {
         req.user.tokens =req.user.tokens.filter((token)=> token.token !== req.token)
         await req.user.save()
         res.send();
}catch(e)
{
    res.status(500).send();
}

})


router.post('/users/logoutall', auth , async(req,res)=>{

    try{
      
        req.user.tokens=[];
        await req.user.save();
        res.send()

    }catch(e)
    {
        res.status(500).send(e);
    }
})

/*****************************LOGIN **********************/

router.post('/users/login',async(req,res)=>{
   
    try
    {
      
       const user=await User.findByCredentials(req.body.email,req.body.password);
       const token=await user.findByAuth();
       res.send({user,token});

    }catch(e)
    {
        res.status(400).send({error:e.message});
    }

})


/******************************************FOR INSERTING************************************/

router.post('/users',async(req,res)=>{
    const user=new User(req.body);

   try{
         await user.save();
         sendWelcomeemail(user.email,user.name);
         const token=await user.findByAuth();
         res.status(201).send({user,token});
        
    }catch(e){

       res.status(400).send({error:e.message});   
    }

    /*user.save().then(()=>{
        res.status(201).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })*/
    
})

/*******************************FOR SEARCHING*********************************/


//to fetch all users we cannot use this route because this will  make othe users to see the email id of all other users includeing them
// router.get('/users',auth,async (req,res)=>{

//     try{
//         const users=await User.find({});
//         res.send(users);
//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
   
//    // User.find({}).then((users)=>{
//    //     res.send(users);
//    // }).catch((e)=>{
//    //     res.status(500).send();
//    // })
// })

router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user);
})

//for fetching users with particular id
// router.get('/users/:id',async(req,res)=>{
//    const id=req.params.id;

//    try{
   
//        const user=await User.findById(id);
//        if(!user)
//        {
//            return res.status(404).send()
//        }
//        res.send(user);

//    }catch(e)
//    {
//        res.status(500).send(e);
//    }

   // User.findById(id).then((user)=>{
   //     if(!user)
   //     {
   //         return res.status(404).send();
   //     }
   //     res.send(user);
   // }).catch((error)=>{
   //     res.status(500).send();
   // })
//})
//////////////////////////////////////**********FOR UPDATING****************////////////////////////////////////////////////////////


router.patch('/users/me',auth,async (req,res)=>{



    //Object.keys() returns an array whose elements are strings corresponding to the enumerable properties found directly upon object .
    const updates=Object.keys(req.body);
    const allowUpdates=['name','email','password','age'];
     
   
    // every() method returns true if all elements in an array pass a test (provided as a function).
    const verified=updates.every((update)=>{
        
        return allowUpdates.includes(update);
    })

   
    //to check hether the field the user is updating is present in schema or not
    if(!verified)
    {
       return res.status(404).send('Invalid updates') ; 
    }
    try{
   
        
        updates.forEach((update)=>{
           req.user[update]=req.body[update]
        })

        await req.user.save();

        //runValidator is set true   because it is used to validate the object we are sending for update
        //new is set true to return the modified object
        //findByIdAndUpdate bypasses mongoose it directly updates in the database to run the middleware we cannot use this
        //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
        
         res.status(200).send(req.user);

    }catch(e)
    {
        res.status(500).send({error:e.message});
    }
})

//DONT NEED THIS 
// router.patch('/users/:id',async (req,res)=>{



//     //Object.keys() returns an array whose elements are strings corresponding to the enumerable properties found directly upon object .
//     const updates=Object.keys(req.body);
//     const allowUpdates=['name','email','password','age'];
     
   
//     // every() method returns true if all elements in an array pass a test (provided as a function).
//     const verified=updates.every((update)=>{
        
//         return allowUpdates.includes(update);
//     })

   
//     //to check hether the field the user is updating is present in schema or not
//     if(!verified)
//     {
//        return res.status(404).send('Invalid updates') ; 
//     }
//     try{
   
//         const user=await User.findById(req.params.id);
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })

//         await user.save();

//         //runValidator is set true   because it is used to validate the object we are sending for update
//         //new is set true to return the modified object
//         //findByIdAndUpdate bypasses mongoose it directly updates in the database to run the middleware we cannot use this
//         //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
//         if(!user)
//         {
//             res.status(404).send();
//         } 
//          res.status(200).send(user);

//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
// })

//////////////////////////////////////*********DELETING THE DATA ************************///////////////////////

router.delete('/users/me',auth,async(req,res)=>{
  
    try{
        
        await req.user.remove();
        sendCancellationemail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e)
    {
        res.status(500).send(e);
    }
})

//we  no longer need this function becuase we dont want to allow user to delete any other user using their id w must allow them only to delete their
//own profile
// router.delete('/users/:id',async(req,res)=>{
  
//     try{
//         const user=await User.findByIdAndDelete(req.params.id);
//         if(!user)
//         {
//             res.status(404).send();
//         }
//         res.send(user);
//     }catch(e)
//     {
//         res.status(500).send(e);
//     }
// })


///////////////////////////////////////////FOR UPLOADING PROFILE IMAGE/////////////////////////////////////

const upload=multer({
    limits:{
    fileSize:1000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|png|jpg)/))
        {
            return cb(new Error("upload only images file"));
        }
        cb(undefined,true);

    }

})
router.post('/users/me/avatar',auth,upload.single('upload'),async(req,res)=>{
    
    //to.Buffer() to convert the data returned from sharp module
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer() 
    req.user.avatar=buffer;
    await req.user.save();
    /*(error,req,res,next) the functon signature shpuld remain this only because this let's the express to know that this function is set up 
    to handle errors.*/
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})  //for sending the error in json response if things dont get well
})

//////////////////////////////////FOR DELETING PROFILE IMAGE////////////////////////////////////////

router.delete('/users/me/avatar',auth,async (req,res)=>{
    try
    {
     if(!req.user.avatar)
     {
         throw new Error("No profile image");
     }
     req.user.avatar=undefined;
     await req.user.save();
     res.send()
    }catch(e)
    {
        res.status(400).send({error:e.message})
    }
})

///////////////////////FOR SERVING PROFILE IMAGE////////////////////////////
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user || !user.avatar)
        {
            throw new Error();
        }
        res.set('Content-Type','image/png'); //it is important to set so that we can serve the binary data we have stored in our database so that the browser can know the type and serve it properly
        res.send(user.avatar)

    }catch(e)
    {
        res.status(400).send();
    }
})
module.exports=router;