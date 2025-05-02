import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT
const __dirname = path.resolve();


app.use(express.json({ limit: '10mb' }));

app.listen(process.env.PORT, ()=>{
    console.log("Server is running: ", PORT);
    connectDB();
})

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
    origin: "https://othousing.vercel.app",
    credentials: true,
})
);
app.use("/", (req, res) => {
    res.send("Hello from server");
});
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.use(express.static(path.join(__dirname, "../frontend/public")));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

