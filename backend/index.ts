import mongoose, { ConnectOptions } from "mongoose";
import threadRoute from "./routes/ThreadRoute";
import userRoute from "./routes/UserRoute";
import categoryRoute from "./routes/CategoryRoute";
import commentRoute from "./routes/CommentRoute";
import express from "express";
import cors from "cors";
const appSettings = require("./config/appsettings_dev.json");

interface AppSettings {
  mongoDb: {
    ConnectionString: string;
    DbName: string;
  };
}

const app = express();
const settings = appSettings as AppSettings;
const port = 3001;
const apiUrl = "/api";

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

app.use(apiUrl, threadRoute);
app.use(apiUrl, userRoute);
app.use(apiUrl, categoryRoute);
app.use(apiUrl, commentRoute);

app.listen(port, () => {
  console.log("Server running on port 3001");
});
