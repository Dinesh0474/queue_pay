"use client"
import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Page = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("adminlogin");
        if (!isLoggedIn) {
            router.push("/adminlogin"); 
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem("adminlogin");
        router.push("/adminlogin")
    }

    const handleSubmit = async () => {
        const data = localStorage.getItem("adminlogin");
        const res= JSON.parse(data)
        const shopId= parseInt(res.shop.shop_id);
        console.log(shopId)
        const body = { name, price:parseInt(price), quantity:parseInt(quantity), shopId };

        try {
            const response = await axios.post(process.env.NEXT_Backend_URL+"/api/products/addproduct", body, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5 overflow-auto capitalize'>
            <div className='h-1/8 w-full flex justify-between'>
                <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
                <div className='flex gap-5'>
                    <Link href="/adminorders">
                <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }}>
                    Orders
                </Button>
                    </Link>
                    <Link href='/products'>
                <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }}>
                    Products
                </Button>
                    </Link>
                    <Button className="w-full bg-slate-900" type="submit" onClick={handleLogout} style={{ backgroundColor: '#595959' }}>
                        Logout
                    </Button>
                </div>
            </div>
            <div className="mt-8">
                <div className="mb-4">
                    <label htmlFor="name" className="block font-semibold mb-2">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-400 p-2 rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block font-semibold mb-2">Price:</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-400 p-2 rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block font-semibold mb-2">Quantity:</label>
                    <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border border-gray-400 p-2 rounded-md" />
                </div>
                <Button className="bg-slate-900 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    );
};

export default Page;
