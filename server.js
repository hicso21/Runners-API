import "./db/mongoDB.js"
import express from "express";
import cors from "cors";
import router from "./routes/v1/index.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://localhost:8000"],
  methods: ["OPTIONS", "GET", "PATCH", "DELETE", "POST", "UPDATE", "PUT"]
}));
app.use(express.json());

// version 1 of the api routes to all brands
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});