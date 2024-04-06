"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Page = () => {
  const [orders, setOrders] = useState([]);
  const [sid,setsid] =useState(0);
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
        setsid(parseInt(shop_id));
        const body = {shop_id};
      try {
        const response = await axios.post("https://queue-server-pe7n.onrender.com"+"/api/shopsadmin/getorders",body,{
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
    <div>
      <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5 capitalize'>
        <div className='h-1/8 w-full flex justify-between '>
          <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
          <div>
            <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }}>
              Logout
            </Button>
          </div>
        </div>
        <div>
          <div className='flex flex-col justify-start mt-4'>
            {orderData && ( // Render if orderData is not null
              <div className="shadow-product">
                <h2>User: {orderData.user.name}</h2>
                <h2>Email: {orderData.user.email}</h2>
                <h2>Contact No: {orderData.user.contactno}</h2>
                <h2>Shop: {orderData.shop.name}</h2>
                <h2>Location: {orderData.shop.location}</h2>
                <h2>Order Status: {orderData.orderStatus}</h2>
                <h2>Products:</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.products.map((product, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even:bg-gray-100" : "odd:bg-gray-100"}>
                          <td className="border px-4 py-2">{product.name}</td>
                          <td className="border px-4 py-2">{product.price}</td>
                          <td className="border px-4 py-2">{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">Total Amount: {orderData.totalAmount}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .shadow-product {
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(11px);
          -webkit-backdrop-filter: blur(11px);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 20px;
          margin-bottom: 20px;
        }

        .quantity-input {
          display: flex;
          align-items: center;
        }

        h2 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        h3 {
          font-size: 16px;
          margin-top: 5px;
        }

        input[type="number"] {
          width: 60px; /* Adjust width as needed */
          margin-left: 10px; /* Adjust spacing between price and input field */
        }

        .even:bg-gray-100 {
          background-color: #f3f4f6; /* Replace with your desired color */
        }

        .odd:bg-gray-100 {
          background-color: #edf2f7; /* Replace with your desired color */
        }
      `}</style>
    </div>
  );
}