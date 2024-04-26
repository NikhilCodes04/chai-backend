import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
dotenv.config({path: './env'});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`App is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed",err);
})













// import express from "express";

// const app = express();

// ( async () => {
//     try {
//         await mongoose.connnect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.error("Errr: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error: ", error);
//         throw err
//     }
// } )();