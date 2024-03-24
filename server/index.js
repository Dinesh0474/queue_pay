const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv').config(); // Import and configure dotenv
const { userauth, shopauth, commonauth } = require('./middleware/check');
const cors = require('cors');
const ordersController = require('./routers/orders');
const productsController = require('./routers/products');
const shopsadminController = require('./routers/shopadmin');
const shopsusersController = require('./routers/shopusers');
const usersController = require('./routers/users');

const app = express();
const PORT = process.env.PORT || 4000; 

app.use(cors());
app.use(express.json());


// Pass userauth middleware to usersController
app.use("/api/users", usersController(prisma, userauth));
// Pass shopauth middleware to shopsController
app.use("/api/shopsadmin", shopsadminController(prisma, shopauth));
app.use("/api/shopsuser", shopsusersController(prisma, userauth));
// Register other controllers
app.use("/api/orders", ordersController(prisma, commonauth));
app.use("/api/products", productsController(prisma, commonauth));

app.get("/", (req, res) => {
    res.send("Hi");
});

app.listen(PORT, () => {
    console.log(`Server started running on PORT ${PORT}`);
});
