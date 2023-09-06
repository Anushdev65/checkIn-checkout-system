import express, { json } from "express";
import errorHandler from "./middleware/errorHandler.js";
import { apiVersion, port } from "./config/config.js";
import { connectDb } from "./connectdb/db.js";
import { config } from "dotenv";
import cors from "cors";
// import { apiVersion, port, staticFolder }

let expressApp = express();
config();

expressApp.use(cors());
expressApp.use(json());

expressApp.use(errorHandler);

connectDb();

expressApp.listen(port, () => {
  console.log(`the port is listening at ${port}`);
});
