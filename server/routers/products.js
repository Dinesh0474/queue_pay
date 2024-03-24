const express=require('express')
const products= express.Router();

module.exports = (prisma, commonauth) => {
    products.use(commonauth);

    products.post("/addproduct", async (req, res) => {
        const { name, price, quantity, shopId } = req.body;
        try {
            const shop = await prisma.shops.findUnique({
                where: { shop_id: shopId }
            });
    
            const product = await prisma.products.create({
                data: {
                    name,
                    price,
                    quantity,
                    shop: { connect: { shop_id: shopId } } // Connect the product to the shop
                }
            });
    
            res.status(200).json(product); // Send created product data in response
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).json({ error: "Error adding product" });
        }
    });

    
    // Update product route
products.post("/updateproduct/:productId", async (req, res) => {
    const productId = parseInt(req.params.productId);
    const { name, price, quantity } = req.body;

    try {
        // Check if the product exists
        const existingProduct = await prisma.products.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update the product
        const updatedProduct = await prisma.products.update({
            where: { id: productId },
            data: {
                name: name || existingProduct.name,
                price: price || existingProduct.price,
                quantity: quantity || existingProduct.quantity
            }
        });

        res.status(200).json(updatedProduct); // Send updated product data in response
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Error updating product" });
    }
});



// Delete product route
products.post("/deleteproduct/:productId", async (req, res) => {
    const productId = parseInt(req.params.productId);

    try {
        // Check if the product exists
        const existingProduct = await prisma.products.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete the product
        await prisma.products.delete({
            where: { id: productId }
        });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Error deleting product" });
    }
});
    return products;
};
