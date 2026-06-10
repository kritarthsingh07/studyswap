import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  console.log("Mongo URI:", env.mongoUri);
  await connectDb(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`StudySwap API listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
