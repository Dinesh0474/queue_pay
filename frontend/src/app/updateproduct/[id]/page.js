"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function Page() {
  const [orderData, setOrderData] = useState(null);
  const params = useParams();
  const id = params.id;

  const handleClick = () => {
    localStorage.removeItem("adminlogin")
    router.push("/adminlogin");
  } 

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminlogin");
    if (!isLoggedIn) {
        router.push("/adminlogin"); 
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post("https://queue-server-pe7n.onrender.com"+`/api/shopsuser/getorderdetails`, {id});
        if (response.ok) {
          setOrderData(data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div>
      <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5'>
        <div className='h-1/8 w-full flex justify-between '>
          <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
          <div>
            <Button className="w-full bg-slate-900" type="submit" onClick={handleClick} style={{ backgroundColor: '#595959' }}>
              Logout
            </Button>
          </div>
        </div>
        <div>
          <div className='flex flex-col justify-start mt-4'>
              <div>
              <h1>{id}</h1>
              
              </div>
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
      `}</style>
    </div>
  );
}
