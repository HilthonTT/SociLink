import mongoose, { ConnectOptions } from "mongoose";

const express = require("express");
const cors = require("cors");
const appSettings: AppSettings = require("./config/appsettings_dev.json");

interface AppSettings {
  mongoDb: {
    ConnectionString: string;
    DbName: string;
  };
}

const settings = appSettings as AppSettings;

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const mongoURI = settings.mongoDb.ConnectionString;

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToMongoDB();

app.listen(port, () => {
  console.log("Server running on port 3001");
});
