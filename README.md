**MyList App**
**Overview**
MyList is a web application that allows users to manage their favorite movies and TV shows. Users can add, view, and organize their watchlist, making it easy to keep track of what they want to watch next.

**Technologies Used**
**Express**.js: MyList backend is built using Express.js, a popular web application framework for Node.js.
**MongoDB**: The application uses MongoDB as its database to store information about movies, TV shows, and user data.
**Redis**: Redis is used for caching to improve performance by storing frequently accessed data in memory.
**dotenv**: The dotenv module is used to load environment variables from a .env file into process.env.
**ioredis**: ioredis is a robust, full-featured Redis client for Node.js.
**Getting Started**
To run the MyList App locally, follow these steps:

Clone this repository to your local machine.
Install dependencies by running npm install.
Set up your environment variables by creating a .env file in the root directory and adding necessary configurations.
Start the server by running npm start.
Access the application by visiting http://localhost:3000 in your web browser.

**Available Endpoints**
**register login User**
router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);

**add movie and tvshows in to the database**
router.post("/addmovie");
router.delete("/deletemovie/:id");
router.post("/addtvshow");

 **add movie and tv   shows to mylist**
router.post("/addtomylist");
router.delete("/removefrommylist/:id" );
router.get("/getallfrommylist" );

Caching Endpoint
GET /cache: This endpoint demonstrates caching functionality. It first checks if data is available in the Redis cache. If cached data exists, it returns the cached data. Otherwise, it fetches the data from the source, caches it for future use, and then returns it.
Contributing
Contributions are welcome! If you find any bugs or have suggestions for improvement, feel free to open an issue or submit a pull request.
