"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import axios from "axios"
export default function Component() {
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [done,setDone] = useState(1);
  const router = useRouter();
  
  const handleClick = async () => {
    // console.log("sdfghj")
    try {
      const body = { email, password };
      const response = await axios.post(process.env.NEXT_Backend_URL+"/api/users/login", body, {
        headers: { "Content-Type": "application/json" }
      });
      const parseRes = await response.data; 
      if(response.status === 200){
        setDone(1);
        localStorage.setItem("userlogin", JSON.stringify(parseRes));
      }else{
        setDone(0)
      }
    } catch (err) {
      setDone(0)
      console.error(err.message);
    }
    if(done === 1) {
      router.push("/userhome");
    } 
  }


  // try {
  //   const body = { email, password, name, contactno };
  //   const response = await axios.post(process.env.NEXT_Backend_URL/api/users/register", body, {
  //     headers: { "Content-Type": "application/json" }
  //   });
  //   const parseRes = await response.data; 
  //   console.log(parseRes); 
  //   if(response.status === 201){
  //     setdone(1);
  //     localStorage.setItem("user", JSON.stringify(parseRes));
  //   }
  // } catch (err) {
  //   setdone(0);
  //   console.error(err.message);
  // }
  // if(done === 1) {
  //   router.push("/userhome");
  // } 

  return (
<div className="fixed h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
<div className="w-1/2 flex flex-col justify-center">

        <h1 className="text-7xl font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">         Queue Pay</h1>
</div>
<div className="w-1/2 flex flex-col justify-center">

    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
            id="email"
             placeholder="" 
             required type="email" 
             onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
            id="password"
             required type="password"
             onChange={e => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" type="submit" onClick={handleClick}>
            Login
          </Button>
          <div className="w-full flex justify-center">

          <Link href="/register">
        <CardDescription className="text-xs justify-center">Register</CardDescription>
          </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
      
</div>
  )
}

