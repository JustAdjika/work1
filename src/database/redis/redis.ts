import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

export default redis;