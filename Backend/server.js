import dotenv from 'dotenv'
dotenv.config();
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import app from './src/app.js'
import connectToDB from './src/config/db.js'

connectToDB()

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})