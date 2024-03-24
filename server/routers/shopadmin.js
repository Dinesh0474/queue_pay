const express=require('express')
const shops= express.Router();

module.exports = (prisma,shopauth) => {
    shops.use(shopauth)
    shops.post("/register", async (req, res) => {
        try { 
            const { name, email, contactno, password, location, key,} = req.body;
            const resdata = await prisma.shops.create({
                data: {
                    name,
                    email,
                    contactno,
                    password,
                    location,
                    key,
                }
            });
            res.status(200).json(resdata); 
        } catch (e) {
            res.status(500).json({ error: e.message }); 
        }
    });
    shops.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check if the shop exists with the provided email
            const existingShop = await prisma.shops.findUnique({
                where: { email }
            });
    
            if (!existingShop) {
                return res.status(404).json({ error: "Shop not found" });
            }
    
            // Check if the password is correct
            const passwordMatch = await password===existingShop.password;
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid password" });
            }
    
            // If email and password match, return the shop data
            res.status(200).json({ shop: existingShop });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    
    shops.post("/getorders", async (req, res) => {
        const { shopId } = req.body;
        try {
            const orders = await prisma.orders.findMany({
                where: { shop_id: shopId },
                select: {
                    id:true,
                    user: {
                        select: {
                            name: true,
                            id: true,
                            email: true
                        }
                    },
                   
                    quantities: true,
                    products: true,
                    totalAmount: true,
                    orderStatus: true,
                    createdAt: true
                }
            });
    
            res.status(200).json(orders); // Send orders data in response
        } catch (error) {
            console.error("Error retrieving orders:", error);
            res.status(500).json({ error: "Error retrieving orders" });
        }
    });
    

    

    return shops;
};
