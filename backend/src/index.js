import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT


app.listen(process.env.PORT, ()=>{
    console.log("Server is running: ", PORT);
    connectDB();
})

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

