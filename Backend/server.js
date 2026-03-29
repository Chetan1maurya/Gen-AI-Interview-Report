import dotenv from 'dotenv'
dotenv.config();
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import app from './src/app.js'
import connectToDB from './src/config/db.js'

connectToDB()

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})