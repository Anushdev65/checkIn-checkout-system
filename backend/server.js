import express, { json } from "express";
import errorHandler from "./middleware/errorHandler.js";
import { apiVersion, port } from "./config/config.js";
import { connectDb } from "./connectdb/db.js";
import { config } from "dotenv";
import cors from "cors";
import apiRouter from "./routes/index.js";
// import { apiVersion, port, staticFolder }
import bodyParser from "body-parser";
let expressApp = express();
config();

expressApp.use(cors());
expressApp.use(json());

expressApp.use(`${apiVersion}`, apiRouter);

expressApp.use(errorHandler);
expressApp.use(bodyParser.json());

connectDb();

expressApp.listen(port, () => {
  console.log(`the port is listening at ${port}`);
});
