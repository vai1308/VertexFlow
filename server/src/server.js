import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env");

console.log("Loading .env from:", envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log(".env loaded successfully");
  console.log("MAILTRAP_API_TOKEN:", process.env.MAILTRAP_API_TOKEN ? "Set" : "Not set");
}

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
