import { createClient } from "redis";

const url = process.env.REDIS_URL;

if(!url) {
    throw new Error('Missing DataBase environment variables');
};

const redis = createClient({
  url,
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

export default redis;