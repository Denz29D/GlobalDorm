import express from "express"
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json()); //middle layer to parse request.body
app.use(express.urlencoded({ extended: true})); //allows to parse form data(urlencoded)

// Use this to parse request and get the cookies
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is runnning on port`, PORT)
    connectMongoDB();
})