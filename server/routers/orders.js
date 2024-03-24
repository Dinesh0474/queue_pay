const express = require('express');
const orders = express.Router();
const jwt = require('jsonwebtoken');

module.exports = (prisma,commonauth) => {
    orders.use(commonauth);
    orders.post("/verifyjwt", async (req, res) => {
        try {
            // Extract token from request body
            const token = req.body.token;
            const {shopId}=req.body
            const keydata = await prisma.shops.findUnique({
                where: { shop_id: shopId },
                select: { key: true }
            });
            const secretkey = keydata.key;
            // Verify the token
            jwt.verify(token,secretkey  , async (err, decoded) => {
                if (err) {
                    // Token verification failed
                    res.json({ valid: false });
                } else {
                    
                    const orderId = parseInt(decoded.orderId);
                    const order = await prisma.orders.findUnique({
                        where: { id: orderId },
                        select: { orderStatus: true }
                    });

                    if (order) {
                        // If order exists, return validity and order status
                        res.json({ valid: true, orderStatus: order.orderStatus });
                    } else {
                        // If order doesn't exist, return validity without order status
                        res.json({ valid: true, orderStatus: null });
                    }
                }
            });
        } catch (error) {
            // Handle error
            console.error("Error verifying JWT:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Route to generate JWT token
    orders.post("/generatejwt", async (req, res) => {
        const { orderId, shopId, userId } = req.body;

        try {
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
            res.json({ token: token });

        } catch (error) {
            // Handle error
            console.error("Error generating JWT:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
        
    orders.post("/addorder", async (req, res) => {
        
        const { userId, shopId, products, quantities, orderStatus } = req.body;
        
        try {
            // Check if the user exists
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });
    
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }
    
            // Check if the shop exists
            const existingShop = await prisma.shops.findUnique({
                where: { shop_id: shopId }
            });
    
            if (!existingShop) {
                return res.status(404).json({ error: "Shop not found" });
            }
    
            let totalAmount = 0;
            for (let i = 0; i < products.length; i++) {
                const product = await prisma.products.findUnique({
                    where: { id: products[i] }
                });
    
                if (!product) {
                    return res.status(404).json({ error: `Product with ID ${products[i]} not found` });
                }
    
                totalAmount += product.price * quantities[i];
            }
            const title="";
            const content="";
            // Create the order
            const order = await prisma.orders.create({
                data: {
                    userid: userId,
                    shop_id: shopId,
                    totalAmount,
                    orderStatus,
                    title,
                    content,
                    products: {
                        connect: products.map(productId => ({ id: productId }))
                    },
                    quantities: { set: quantities }
                }
            });
    
            res.status(201).json(order); // Send created order data in response
        } catch (error) {
            console.error("Error adding order:", error);
            res.status(500).json({ error: "Error adding order" });
        }
    });

    // Change status route
orders.post("/changestatus/:orderId", async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const { orderStatus } = req.body;

    try {
        // Check if the order exists
        const existingOrder = await prisma.orders.findUnique({
            where: { id: orderId }
        });

        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Update the order status
        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { orderStatus }
        });

        res.status(200).json(updatedOrder); // Send updated order data in response
    } catch (error) {
        console.error("Error changing order status:", error);
        res.status(500).json({ error: "Error changing order status" });
    }
});

// USE IT FOR 
orders.get("/getstatus/:orderId", async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    try {
        // Fetch the order
        const order = await prisma.orders.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Return the order status
        res.status(200).json({ status: order.orderStatus });
    } catch (error) {
        console.error("Error getting order status:", error);
        res.status(500).json({ error: "Error getting order status" });
    }
});




    return orders;
};
