import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT


app.use(express.json());

app.listen(process.env.PORT, ()=>{
    console.log("Server is running: ", PORT);
    connectDB();
})

app.get("/api/auth",(req, res)=>{
    res.send('HELLO SERVER IS UP')
})