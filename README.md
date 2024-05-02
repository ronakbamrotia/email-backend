# Email notification backend service
To set up this project on your local environment follow the below steps
- Rename the .env.sample file to .env
- Provide the value of all the variables in .env
- Run command "npm install" to install all the dependencies
- Run command "npm run dev" in the project root
- cd into "/workers" directory and run command "node emailNotificationWorker.js" this will start a single worker process to process the emails from the queue