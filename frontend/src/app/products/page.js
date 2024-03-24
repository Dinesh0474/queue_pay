"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Page = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const handleClick = () => {
    localStorage.removeItem("adminlogin");
    router.push("/adminlogin");
  };


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminlogin");
    if (!isLoggedIn) {
        router.push("/adminlogin"); 
    }
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete("https://server-qkme.onrender.com"+`/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddButton = () => {
    router.push("/addproduct");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const data = localStorage.getItem("adminlogin");
      const res = JSON.parse(data);
      const shopId = parseInt(res.shop.shop_id);

      try {
        const response = await axios.get("https://server-qkme.onrender.com"+`/api/shopsuser/getproducts/${shopId}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5'>
      <div className='h-1/8 w-full flex justify-between'>
        <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
        <div className='flex gap-5'>
          <Link href="/adminorders">
          <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }}>
            Orders
          </Button>
          </Link>
          <Link href="/addproduct">
          <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }} onClick={handleAddButton}>
            Add Product
          </Button>
          </Link>
          <Button className="w-full bg-slate-900" type="submit" onClick={handleClick} style={{ backgroundColor: '#595959' }}>
            Logout
          </Button>
        </div>
      </div>
      <div>
        {products.length === 0 ? (
          <div className="text-center mt-4 text-gray-500">Currently no products available.</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {products.map(product => (
              <div key={product.id} className="border p-4 rounded-lg capitalize">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p>Price: {product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <Button onClick={() => handleDelete(product.id)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
