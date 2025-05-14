import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from 'cors';
import bodyParser from "body-parser";
import session, { Cookie } from "express-session";
// import Product_db, { categorys_db, keranjang_db } from "./models/productModel.js";
// import { API2 } from "../projek/src/utilts/constans.js";

// import Users from "./models/userModel.js";

dotenv.config()
const app = express();
// const bodyParser = bodyParser()
// const session = session()



//midlewere
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//session config
app.use(session({
    secret : 'secretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))


//mock user data
const user = {
    user1 : {
        password: 'pass1'
    }
}




try {
    await db.authenticate();
    console.log('database Connected');
    // await keranjang_db.sync();
} catch (error) {
    console.log(error)
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(express.json())
app.use(router)



app.listen(3005, () => console.log('server running at port 3005'))
