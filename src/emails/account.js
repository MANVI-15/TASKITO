const sgmail=require('@sendgrid/mail')
const sendgridAPIkey='__API_KEY______' 

sgmail.setApiKey(sendgridAPIkey); //to tell the send grid that we want to work with the given API passed as argument


const sendWelcomeemail=(email,name)=>{
    
    sgmail.send({
    to:email,
    from:'manvi.jiit@gmail.com',
    subject:'Thanks for joining in!',
    text:`Welcome to the app, ${name}.Let me know how you get along with the app`  
})

}

const sendCancellationemail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'manvi.jiit@gmail.com',
        subject:'Sorry to see you go!',
        text:`Why you cancelled the registration, ${name}.Let me know how we can improve`
    })
}

const sendmail=(email,tasks)=>{
   sgmail.send({
     to:email,
     from:'manvi.jiit@gmail.com',
     subject:'List of incomplete tasks',
     html:`
    <html>
      <head>
        <title></title>
      </head>
      <body>
      ${tasks}
      </body>
    </html>
  `
   })
}

module.exports={
    sendWelcomeemail,
    sendCancellationemail,
    sendmail
};
