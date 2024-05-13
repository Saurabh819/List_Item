import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/route";
import connectDB from "./db/db";
import Redis from "ioredis";

const redis = new Redis();
dotenv.config();
connectDB();
const app: Express = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from server");
});

app.get("/cache", async (req, res) => {
  const cachedData = await redis.get("cachedData");

  if (cachedData) {
    // If data exists in the cache, return it
    res.send(JSON.parse(cachedData));
  } else {
    // If data is not in the cache, fetch it from the source
    const dataToCache = { message: "Data to be cached" };
    await redis.set("cachedData", JSON.stringify(dataToCache), "EX", 3600); // Cache for 1 hour
    res.send(dataToCache);
  }
});

app.listen(PORT, () => {
  console.log("Server is running at 5000");
});
