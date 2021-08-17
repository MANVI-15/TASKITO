# TASK-APP

This is a Task-Manager REST API.Where user can maitain the list of its day to day work.

<h1>Features</h1>
 <ul>
   <li>Create ,update and delete a user account.</li>
   <li>Sending automated email using the SendGrid API.</li>
   <li>Create, edit and delete tasks.</li>
   <li>User can upload profile image.</li>
   <li>Sending automated emails with SendGrid whenever a new user is created or deletednd a notification mail every midnight to every user specifying the list of task they haven't completed  nd a notification mail every midnight to every user specifying the list of task they haven't completed </li>
</ul>


<h1>Run the project</h1>
<ul>
<li>Clone this project</li>
<li>Run npm install in your command line</li>
<li>Create a dev.env file inside a config folder in the root of the project with the URL to your MongoDB, your port, your SendGrid credentials and your secret</li>
<li>Run npm start in your command line</li>
<li>Visit http://localhost:3000 in your browser</li>
</ul>

<h1>Tech stack</h1>
 <ul>
  <li>Node.js</li>
  <li>Express</li>
  <li>MongoDB</li>
  <li>JWT for authentication</li>
  <li>Sendgrid API</li>
  <li>Node-cron</li>
 </ul>
