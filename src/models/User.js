//database model for users

const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('./Task')

//USER MODEL DESCRIPTION AND ( DATA VALIDATION AND DATA SANITIZATION IMPLEMENTATION) CHECKS


const UserSchema=new mongoose.Schema({
    name:
    {
        type: String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true, 
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    age:
    {
       type:Number,
       default:0,
       validate(value)
       {
           if(value<0)
           {
               throw new Error('Age must be a positive number')
           }
       }
    },
    password:
    {
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
           if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password is invalid');   
            }
        }
    },
    tokens:[{
         token:
         {
             type: String,
             required: true,
         }
    }],

    //avatar: to store the profile image
    avatar:{
        type:Buffer
    }

},{
    //adds two new properties created and deleted at the time of creation
    timestamps: true
})

/*In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.

Mongoose also supports populating virtuals. A populated virtual contains documents from another collection. To define a populated virtual, 
you need to specify:

The ref option, which tells Mongoose which model to populate documents from.
The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this 
document's localField.*/

UserSchema.virtual('tasks',{
    ref: 'Task',
    localField:'_id',
    foreignField :'owner'
})

//FUNCTION FOR VERIFYING CREDENTIALS OF USERS DURING LOGIN
UserSchema.statics.findByCredentials = async(email,password)=>{

    
    const user=await User.findOne({email});

    if(!user)
    {
        throw new Error("Unable to login");
    }


    const isMatch= await bcrypt.compare(password,user.password);

    if(!isMatch)
    {
        throw new Error("Unable to Login");
    }


    return user;
}


/*every time when express sends the  reponse back it stringifies the objet in response and whenver we stringify the object toJSON is called 
automatically on which it is defined*/

/*Whenever we display the user data we dont want token and password to be displayed to the user and since res function will call toJson automatically
because at backend express stringifies teh object*/
UserSchema.methods.toJSON=function()
{
    const user=this;
    const obj=user.toObject();  //toObject() Converts this document into a plain-old JavaScript object 

    delete obj.password;
    delete obj.tokens;
    delete obj.avatar //because it wil be too  big to serve

    return obj;

}


//STATIC METHODS ARE ACCESSIBLE BY WHOLE MODEL LIKE USER SOMETIME KNOWN aS MODEL METHODS
//METHODS ARE ACCESIBLE BY INSTANCE 



//FUNCTION FOR GENERATING AUTHENTICATION TOKEN FOR USER
UserSchema.methods.findByAuth=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},'thisismysummerproject');
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
}



//middleware are special function provided by moongose to perform special task
//.pre to perform something before some task
//for hashing the plain text password before storing it in database
UserSchema.pre('save',async function(next){
  const user=this;

  //user.isModified() return true if new user is added or if password field of exisitng user is modified it is also provided by moongose
  if(user.isModified('password'))
  {
      user.password=await bcrypt.hash(user.password,8);
  }
  next();
})


//for deleting all tasks when the user is deleted middleware wiLL be called when we use remove
UserSchema.pre('remove',async function(next){
    const user=this;
    await Task.deleteMany({owner:user._id});
    next();
})
const User=mongoose.model('User', UserSchema)

module.exports=User;
