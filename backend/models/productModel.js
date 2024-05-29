import { Sequelize } from "sequelize";
// import db_product from "../config/DataProduct.js";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product_db = db.define('Products', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    nama:{
        type: DataTypes.STRING
    },
    harga:{
        type: DataTypes.INTEGER
    },
    is_ready:{
        type: DataTypes.BOOLEAN
    },
    gambar:{
        type: DataTypes.STRING
    },
    category_id:{
        type: DataTypes.INTEGER
    },
    refresh_token:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
})

export default Product_db



export const categorys_db = db.define('categorys', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    nama:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
})

export const keranjang_db = db.define('keranjangs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    qty:{
        type: DataTypes.INTEGER
    },
    harga:{
        type: DataTypes.INTEGER
    },
    product_id:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName: true
})

// in your product model file
Product_db.hasMany(keranjang_db, { foreignKey: 'product_id' });

// in your keranjang model file
keranjang_db.belongsTo(Product_db, { foreignKey: 'product_id' });