import { Sequelize } from "sequelize";

const db_product = new Sequelize('Product_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

export default db_product