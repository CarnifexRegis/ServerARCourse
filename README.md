### ServerARCourse

## Running the node js code
- install nodejs, visual studio code (VCS) ide (best ide)
- go into the VCS terminal and type  

npm install  

This installs the needed dependencies (specified in package.json)
then do  

node "./src/server.js"  

Still didn't test it with local mongodb this is initial stuff 


## Running a mongodb server

- Install mongodb server from the website  
- Also install mongodbcompass (should be included as an option)  
- run mongod.exe from the mongodb install repository with this line in cmd

mongod --dbpath "Path to a data folder that will contain all the data"

leave the cmd now open mongodbCompass  
- In New connection click on "Fill in connection fields individually"  
- Leave the basic data (Localhost in hostname and Port 27017)  
- You should see the contained stuff inside the db.   
- When you run the node server for the first time a new collection containing the anchors will be created
