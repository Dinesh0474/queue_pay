"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Page = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const handleClick = () => {
      router.push("/products");
  }

  const handleLogout = () => {
      localStorage.removeItem("adminlogin")
      router.push("/adminlogin")
  }
      useEffect(() => {
        const isLoggedIn = localStorage.getItem("adminlogin");
        if (!isLoggedIn) {
            router.push("/adminlogin"); 
        }
      }, []);

  useEffect(() => {
    const fetchOrders = async () => {
        
        const shop_id = localStorage.getItem("adminlogin");
        const body = {shop_id};
      try {
        const response = await axios.post(process.env.NEXT_Backend_URL+"/api/shopsadmin/getorders",body,{
            headers: { "Content-Type": "application/json" }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []); 

  return (
    <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5'>
      <div className='h-1/8 w-full flex justify-between'>
        <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
        <div>
          <Button className="w-full bg-slate-900" type="submit" onClick= {handleClick}style={{ backgroundColor: '#595959' }}>
            Product
          </Button>
          <Button className="w-full bg-slate-900" type="submit" onClick={handleLogout} style={{ backgroundColor: '#595959' }}>
    Log Out
</Button>

        </div>
      </div>
      <div>
        {orders.map(order => (
          <div key={order.id} className="border p-2 mb-4 rounded">
            <h2 className="font-bold text-lg">Order ID: {order.id}</h2>
            <p>Product: {order.product}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Total Price: {order.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
