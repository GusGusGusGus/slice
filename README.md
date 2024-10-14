# Slice App 

## Fractional Real-Estate Investing 🏰🏗️🏡🏬🏛️

### Features: 
- User profiles with Description, Looking For, Interests, Photo Gallery and Messages
- Paged Users' List with Filters
- Members I like / Members who like me Lists
- Details Edit page
- Login/Logout User
- Register new User
- Email confirmation and password reset
- Messages List
- User Online Notifications
- Instant message chat
- Client cache for improved performance
- 3 Different user Roles: Admin, Moderator and Member
- Admin area to manage user permissions (WIP: manage photos)
- Much more to come!...



## [Live demo coming soon]()


### Client: 
*Angular 17* 🅰️
### Server: 
*.Net 7* #️⃣
### ORM: 
*Entity Framework Core* 🦄
### DB: 
*PostgreSQL* 🐘

### Development Notes: 
Install pgAdmin or some other DBMS to manage PortgreSQL locally
Install docker desktop for your OS and run a docker postgres image in your machine with the command:
`docker run --name dev -e POSTGRES_USER=YourPostgreSQLUser -e POSTGRES_PASSWORD=YourPostgresPasswordHere -p 5432:5432 -d postgres:latest`
In the API project's root, reate an appsettings.Development.json file and add the connection string to the postgres container:
` "ConnectionStrings": {  "DefaultConnection": "Server=localhost; Port=5432; User id=YourPostgreSQLUser; Password=YourPasswordHere; Database=yourDBName" } `
as well as your Sendgrid Email Server Key: 
` "SendGridKey": "verySecretKeyHere", "SupportEmail": "yourOwnServiceEmail@yourDomain.com", `
and the baseUrl for your client on dev:
` "BaseUrl": "https://localhost:4200/", `
and respective copies on your production settings.


### Deployment Notes: 
For the client, run `ng build --configuration production` to generate the dist folder. 
My instance is deployed to Heroku. Create an account and login locally. In the Heroku dashboard, create the app.
Then, within the git repo, set the remote to point to that heroku app with `heroku git:remote -a theNameOfYourHerokuApp`.
Within Heroku, I installed the Heroku Postgres Add-on
In my local Heroku CLI, I used jincod's Heroku DotnetCore Buildpack with the command: `heroku buildpacks:set https://github.com/jincod/dotnetcore-buildpack`
Afterwards set the environment to production: `heroku config:set ASPNETCORE_ENVIRONMENT=Production`
Push: `git push origin main`


### Post-Deployment Notes: 
After logging in to Heroku CLI on your local machine, please run the post_deployment.bat file after pushing to origin main branch on first run, as it will fetch the heroku app url and set it as an ALLOWED ORIGIN environment variable within the heroku platform. If you don't do this, you might experience CORS errors on runtime.


