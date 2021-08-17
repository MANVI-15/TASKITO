const express=require('express');
const router=new express.Router();
const Task=require('../models/Task')
const auth=require('../middlewares/auth');


/***********************FOR INSERTING******************* */


// to create new task

//1.user must be authenticated to create new task

router.post('/tasks',auth,async (req,res)=>{
    //const task=new Task(req.body);
    const task=new Task({
        ...req.body,
        owner: req.user._id //middleware can attach properties in request object
    })
 
    try{
        
        await task.save();
        res.status(200).send(task);
    }catch(e){
      
       res.status(400).send(e);
    }
    
 //    Task.save().then((task)=>{
 //        res.status(201).send(task);
 //    }).catch((e)=>{
 //        res.status(400).send(e);
 //    })
 })
 
 /*******************************FOR SEARCHING*********************************/
 
 
 
 //to fetch all tasks
 
 // GET /tasks?completed=true
 //GET /tasks?limit=10&skip=20
 //GET /tasks?sortBy=createdAt:desc
 router.get('/tasks',auth,async (req,res)=>{
     
    const match={}
    const sort={}

    if(req.query.completed)
    {
          match.completed = req.query.completed ==='true'
    }
    if(req.query.sortBy)
    {
       const parts=req.query.sortBy.split(':');
       sort[parts[0]] = parts[1]==='desc'?-1:1;
    }
     try{
          await req.user.populate({
              path: 'tasks',
              match,
              options:{
                  limit:parseInt(req.query.limit), // for setting the limit on number of obj to be displayed at a page
                  skip:parseInt(req.query.skip), //for skipping pages
                  sort  //for sorting the data

              }
          }).execPopulate();

          res.send(req.user.tasks);
 
     }catch(e)
     {
         res.status(500).send(e);
     }
     // Task.find({}).then((tasks)=>{
     //    res.send(tasks);
 
     // }).catch((e)=>{
         
     //     res.send(500).status();
     // })
 })
 
 //to fetch tasks by id
 
 router.get('/tasks/:id',auth,async (req,res)=>{
     const id=req.params.id;
 
     try{
     
         //const task=await Task.findById(id);
         const task=await Task.findOne({_id:id, owner:req.user._id});
         
         if(!task)
         {
             return res.status(404).send()
         }
         res.send(task);
 
     }catch(e)
     {
         res.status(500).send(e);
     }
 
     // Task.findById(id).then((task)=>{
     //     if(!task)
     //     {
     //         return res.status(404).send();
     //     }
     //     res.send(task);
     // }).catch((error)=>{
     //     res.status(500).send();
     // })
 })
 
 
 //////////////////////////////////////**********FOR UPDATING****************////////////////////////////////////////////////////////
 
 //1. User will be authenticated
 //2.  then we will convert the req in list to validate that whether fields to be updated are valid or not
 //3. if the fields are valid then user is updated
 
 
 router.patch('/tasks/:id',auth,async (req,res)=>{
     
     const updates=Object.keys(req.body);
     const allowupdates=['description','completed'];

     //every returns true only when all are verified
     const verified=updates.every((update)=>{
         return allowupdates.includes(update);
     })
 
     if(!verified)
     {
         return res.status(404).send("Invalid updates");
     }
 
     try
     {
         const task=await Task.findOne({_id:req.params.id,owner:req.user._id});

         if(!task)
         {
             res.status(404).send(e);
         }

         updates.forEach((update)=>{
             task[update]=req.body[update];
         })

         await task.save();
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
         res.send(task);
     }catch(e)
     {
         res.status(500).send(e);
     }
 
 })
 
 
 //////////////////////////////////////*********DELETING THE DATA ************************///////////////////////
 

 //User must be authenticated to deleted the tasks for which auth function will be called
 
 router.delete('/tasks/:id',auth,async(req,res)=>{
     try{
         const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
         if(!task)
         {
             res.status(404).send();
         }
         res.send(task);
     }catch(e)
     {
         res.status(500).send(e);
     }
 })
 
module.exports=router;