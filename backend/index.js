import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import cors from 'cors';
// import Product_db, { categorys_db, keranjang_db } from "./models/productModel.js";
// import { API2 } from "../projek/src/utilts/constans.js";

// import Users from "./models/userModel.js";

dotenv.config()
const app = express();




// app.get(API2 + "/keranjangs", async (req, res) => {
//     const sqlQuery = `
//     SELECT
//         products.nama,
//         keranjangs.product_id,
//         keranjangs.qty,
//         keranjangs.harga,
//         COUNT(keranjangs.product_id) AS JumlahPesanan
//     FROM keranjangs
//     INNER JOIN products ON keranjangs.product_id = products.id
//     GROUP BY
//         products.id;
//     `;

//     db.all(sqlQuery, [], (err, rows) =>{
//         if(err){
//             return res.status(500).json({message: err.message});
//         }

//         res.json(rows)
//     })
// })

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
