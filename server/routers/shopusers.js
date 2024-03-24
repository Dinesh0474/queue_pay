const express=require('express')
const shops= express.Router();
const jwt = require('jsonwebtoken');

module.exports = (prisma,userauth) => {
    shops.use(userauth)

    
    shops.get("/getproducts/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const shopWithProducts = await prisma.shops.findUnique({
                where: { shop_id: parseInt(id) }, 
                select: {
                    shop_id: true,
                    name: true,
                    location: true,
                    key: true,
                    products: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            quantity: true
                        }
                    }
                }
            });
            res.status(200).json(shopWithProducts);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
    
    shops.get("/getall", async (req, res) => {
        const data = await prisma.shops.findMany({
            select: {
              shop_id: true,
              name: true,
              location: true
            }
          });
          res.status(200).json(data); 
    });
    shops.post("/getqueue", async (req, res) => {
        try {
            const { id } = req.body;
            
            // Find the order associated with the provided ID
            const order = await prisma.orders.findUnique({
                where: { id: parseInt(id) }
            });
            
            if (!order) {
                // Order not found
                return res.status(404).json({ error: "Order not found" });
            }
    
            // Find the shop associated with the found order
            const shop = await prisma.shops.findUnique({
                where: { shop_id: order.shop_id },
                select: {
                    orders: {
                        where: {
                            orderStatus: "inprocess"
                        },
                        select: {
                            id: true
                        }
                    }
                }
            });
    
            if (!shop) {
                // Shop not found
                return res.status(404).json({ error: "Shop not found" });
            }
    
            // Get the index of the order in the array of orders with "inprocess" status
            const orderIndex = shop.orders.findIndex(item => item.id === order.id);
            
            if (orderIndex === -1) {
                // Order not found in the queue
                return res.status(404).json({ error: "Order not found in the queue" });
            }
    
            // Calculate the position of the order in the queue and subtract 1
            const positionInQueue = orderIndex;
    
            // Respond with the position of the order in the queue
            res.status(200).json(positionInQueue);
        } catch (error) {
            // Internal server error
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
    
    shops.post("/getorderdetails", async (req, res) => {
        const { id } = req.body;
    
        try {
            // Retrieve orders for the specified user
            const orders = await prisma.orders.findMany({
                where: { userid: parseInt(id) },
                select:{
                    id:true,
                    user: true,
                    shop: {
                        select: { shop_id: true, name: true, location: true } // Select only necessary fields for shop
                    },
                    products: true,
                    orderStatus: true, // Include orderStatus field
                    quantities: true, // Include quantities field
                    totalAmount: true // Include totalAmount field
                }
            });
    
            res.status(200).json(orders); // Send orders data in response
        } catch (error) {
            console.error("Error retrieving orders:", error);
            res.status(500).json({ error: "Error retrieving orders" });
        }
    });
    shops.post("/getorder", async (req, res) => {
        const { id } = req.body;
   
        try {
            // Retrieve orders for the specified user
            const orders = await prisma.orders.findMany({
                where: { id: parseInt(id) },
                select:{
                    user: true,
                    shop: {
                        select: { shop_id: true, name: true, location: true } // Select only necessary fields for shop
                    },
                    products: true,
                    orderStatus: true, // Include orderStatus field
                    quantities: true, // Include quantities field
                    totalAmount: true // Include totalAmount field
                }
            });
    
            const orderId = id;
            const shopId= orders[0].shop.shop_id;
            const userId = orders[0].user.id;


            const payload = {
                orderId: orderId,
                shopId: shopId,
                userId: userId
            };

            const keydata = await prisma.shops.findUnique({
                where: { shop_id: shopId },
                select: { key: true }
            });
            const secretkey = keydata.key;
            const token = await jwt.sign(payload, secretkey, { expiresIn: 20 });


            res.status(200).json({orders,token}); // Send orders data in response

        } catch (error) {
            console.error("Error retrieving orders:", error);
            res.status(500).json({ error: "Error retrieving orders" });
        }
    });
    
    return shops;
};
