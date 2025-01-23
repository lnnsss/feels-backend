import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import routes from "./routes/index-route.mjs";

dotenv.config();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("connected to db"))
  .catch((err) => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  try {
    console.log(`listening on port ${port}`);
  } catch (err) {
    console.error(err);
  }
});
