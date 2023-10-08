import express from "express";
import { config } from "dotenv";

import cors from "cors";

import { nodeApi } from "./routers/images.js";

const app = express();
app.use(cors());
config();

app.use("/api", nodeApi);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running in http://localhost:${PORT}`);
});
