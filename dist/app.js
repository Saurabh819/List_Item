"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const route_1 = __importDefault(require("./routes/route"));
const db_1 = __importDefault(require("./db/db"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use("/api", route_1.default);
app.get("/", (req, res) => {
    res.send("Hello from server");
});
app.get("/cache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedData = yield redis.get("cachedData");
    if (cachedData) {
        // If data exists in the cache, return it
        res.send(JSON.parse(cachedData));
    }
    else {
        // If data is not in the cache, fetch it from the source
        const dataToCache = { message: "Data to be cached" };
        yield redis.set("cachedData", JSON.stringify(dataToCache), "EX", 3600); // Cache for 1 hour
        res.send(dataToCache);
    }
}));
app.listen(PORT, () => {
    console.log("Server is running at 5000");
});
