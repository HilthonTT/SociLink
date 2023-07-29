import mongoose, { ConnectOptions } from "mongoose";
import threadRoute from "./routes/ThreadRoute";
import userRoute from "./routes/UserRoute";
import categoryRoute from "./routes/CategoryRoute";
import commentRoute from "./routes/CommentRoute";
import express from "express";
import cors from "cors";

interface AppSettings {
  mongoDb: {
    ConnectionString: string;
    DbName: string;
  };
  frontend: {
    url: string;
  };
}

const environment = process.env.NODE_ENV;
const isDebug = environment === ("development" as string);
let appSettings = {} as AppSettings;

if (isDebug as boolean) {
  appSettings = require("./config/appsettings_dev.json") as AppSettings;
} else {
  appSettings = require("./config/appsettings.json") as AppSettings;
}

const app = express();
const port = 3001;
const apiUrl = "/api";

const corsOptions = {
  origin: appSettings.frontend.url,
};

app.use(express.json());
app.use(cors(corsOptions));

const mongoURI = appSettings.mongoDb.ConnectionString;

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
