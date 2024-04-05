"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Link from 'next/link'
import axios from 'axios';
import {GlowingStarsBackgroundCardPreview} from './Glow'
const Page = () => {
  const [shops, setShops] = useState([]);
  const router = useRouter();

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
    axios.get("https://queue-server-pe7n.onrender.com"+'/api/shopsuser/getall')
      .then(response => {
        // Assuming response.data contains the array of shops
        setShops(response.data);
        console.log(shops)
      })
      .catch(error => {
        console.error('Error fetching shops:', error);
      });
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  return (
    <div className='fixed h-full w-full  bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5'>
      <div className='h-1/8 w-full  flex  justify-between'>
        <h1 className="font-medium  bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
        <div className='flex gap-5'>
          <Link href="/myorders">
        <Button className="w-full bg-slate-900" type="submit" style={{ backgroundColor: '#595959' }}>
            Myorders
          </Button>
          </Link>
          <Button className="w-full bg-slate-900" type="submit" onClick= {handleClick} style={{ backgroundColor: '#595959' }}>
            LogOut
          </Button>
        </div>
      </div>
      <div className='flex  justify-start mt-4'>
        <h1 className="font-medium  text-7xl bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Shops</h1>
      </div>
      <div className='flex gap-10'>

        {/* <GlowingStarsBackgroundCardPreview  Title="fghj" Description="fghj" /> */}
        {shops.map(shop => (
  <div key={shop.shop_id}>
    <Link href={"/shop/" + shop.shop_id.toString()}>
      {/* <h1>{shop.name}</h1> */}
      <GlowingStarsBackgroundCardPreview Title={shop.name} Description={shop.location} />
    </Link>
  </div>
))}

        </div>
    </div>
  );
};

export default Page;
