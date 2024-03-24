"use client"
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import { useRouter } from "next/navigation";
import QRCode from 'qrcode.react';


const Page = () => {
    const [orders, setOrders] = useState([]); 
    const [id, setId] = useState(-1); 
    const router = useRouter();
  
    const handleNavigation = async (pageid) => {
      router.push("/orderdetails/" + pageid.toString());
    }
    const handleClick = () => {
      localStorage.removeItem("userlogin")
      router.push("/login");
    } 
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("userlogin");
      if (!isLoggedIn) {
          router.push("/login"); 
      }
    }, []);
  
    useEffect(() => {
      const fetchOrders = async () => {
        console.log(id);
        if (id === -1) await fetchId();
        try {
          const response = await axios.post("https://server-qkme.onrender.com"+`/api/shopsuser/getorderdetails`, { id });
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      const fetchId = async () => {
        try {
          const data = await localStorage.getItem("userlogin");
          const user = JSON.parse(data);
          const userId = user.id;
          setId(userId);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      };
  
      fetchId(); 
      fetchOrders();
    }, [id]); 
  
    const groupedOrders = orders.reduce((acc, order) => {
      const status = order.orderStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order);
      return acc;
    }, {});
  
    return (
      <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5 overflow-auto capitalize'>
        <div className='h-1/8 w-full flex justify-between'>
          <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
  
          <div>
            <Button className="w-full bg-slate-900" type="submit" onClick={handleClick} style={{ backgroundColor: '#595959' }}>
              Logout
            </Button>
          </div>
        </div>
        <div>
          <br />
          {Object.entries(groupedOrders).map(([status, orders]) => (
            <div key={status}>
              <h2 className="text-2xl mb-4">{status}</h2>
  
              {orders.map((order, index) => (
                <div key={order.id + index} className="mb-8">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xl font-bold">Order {order.id}</h3>
                    <Button className="w bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }} onClick={() => handleNavigation(order.id)}>
                      Details
                    </Button>
                  </div>
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
                        {order.products.map((product, i) => (
                          <tr key={i} className="odd:bg-gray-100">
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.price}</td>
                            <td className="border px-4 py-2">{order.quantities[i]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">Total Amount: {order.totalAmount}</p>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    );
  };
  
  export default Page;