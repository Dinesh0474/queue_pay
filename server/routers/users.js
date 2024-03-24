const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');

module.exports = (prisma, userauth) => {
    users.use(userauth);

    users.post("/login", async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
    
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            user.password=""
            res.status(200).json( user);
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ error: "Error logging in" });
        }
    });
    
    users.post("/register", async (req, res) => {
        const { name, email, contactno, password } = req.body;
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds parameter
    
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    contactno,
                    password: hashedPassword 
                }
            });
    
            res.status(201).json(user); // Send created user data in response
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Error creating user" });
        }
    });

    return users;
};
