import Users from "../models/userModel.js";
import Product_db, { categorys_db, keranjang_db } from "../models/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { query } from "express";
import { Sequelize , QueryTypes } from "sequelize";
import db from "../config/Database.js";



export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll(
            {attributes: ['id', 'name', 'email']}
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        const user = await Users.findAll({
            where: {
                email
            }
        });
        if(user[0]) return res.status(409).json({msg: "Email already registered"});
        await Users.create({
            name,
            email,
            password: hashPassword
        });
        res.json({msg: "Register Success"})
}   catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
       
} catch (error) {
    res.status(404).json({msg: error.message});
}
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null}, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
} 

export const products = async (req, res) => {
    // const { nama, harga, gambar, category_id, is_ready } = req.body;
    try {
        const product = await Product_db.findAll({
          attributes: ['id', 'nama', 'harga', 'gambar', 'is_ready', 'category_id'],
          where: {
            is_ready: true
          }
           
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}


export const categorys = async (req, res) => {
    const { nama } = req.body;
    try {
        await categorys_db.create({
            nama
        });
        // res.status(200).json(product);
        res.json({msg: "categorys Success"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}


export const keranjangs = async (req, res) => {
    const { qty, harga, product_id } = req.body;
    try {
        await keranjang_db.create({
            qty,
            harga,
            product_id
        });
        res.json({msg: "keranjangs Success"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}



export const keranjangs2 = async (req, res) => {
    try {
        const keranjang = await db.query(
            `SELECT
                products.nama,
                keranjangs.product_id,
                keranjangs.harga,
                products.gambar,
                COUNT(keranjangs.product_id) AS JumlahPesanan,
                SUM(keranjangs.harga) AS TotalHarga
            FROM keranjangs
            INNER JOIN products ON keranjangs.product_id = products.id
            GROUP BY products.id`,
            {
                type: QueryTypes.SELECT
            }
        );
        res.json({  keranjang });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await keranjang_db.destroy({
            where: {
                product_id: id
            }
        });
        res.json({msg: "delete beres"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}


// export const getOrderProduct = async (req, res) => {
//     const { id, product_id } = req.params;

//     const opt = {
//         sql: `SELECT
//         products.nama,
//         keranjangs.product_id,
//         keranjangs.harga,
//         COUNT(keranjangs.product_id) AS JumlahPesanan,
//         SUM(keranjangs.harga) AS TotalHarga
//     FROM keranjangs
//     INNER JOIN products ON keranjangs.product_id = products.id
//     GROUP BY
//         products.id;
//         where keranjangs.product_id = ${product_id} and products.id = ${id};
//     `,
//     nestTables: true
//     };

//     try {
//         const data = await query(opt);

//         const responseBody = [];
//         for (const row of data) {
//             const { product, keranjang } = row 
//             const indexOf = responseBody.findIndex(item => item.product_id === product.id);

//             if (indexOf === -1) {
//                 responseBody.push({
//                     ...keranjang,
//                     product: [product]
//                 });

//             } else {
//                 responseBody[indexOf].product.push(product);
//             }
//         }
//         return res.json(Success("keranjang", responseBody));
// } catch (error) {
//     res.status(400).json({msg: error.message});
// }
// }