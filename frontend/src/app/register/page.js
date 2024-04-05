"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from 'axios'; // Import Axios

export default function Component() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactno, setContactno] = useState("");
  const [password, setPassword] = useState("");
  const router=useRouter();
  const [done, setdone] =useState(1)
  const handleClick = async () => {
    

    try {
      const body = { email, password, name, contactno };
      const response = await axios.post("https://queue-server-pe7n.onrender.com"+"/api/users/register", body, {
        headers: { "Content-Type": "application/json" }
      });
      const parseRes = await response.data; 
      console.log(parseRes); 
      if(response.status === 201){
        setdone(1);
        localStorage.setItem("userlogin", JSON.stringify(parseRes));
      }
    } catch (err) {
      setdone(0);
      console.error(err.message);
    }
    if(done === 1) {
      router.push("/userhome");
    } 
  }


  return (
    <div className="fixed h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="w-1/2 flex flex-col justify-center">
        <h1 className="text-7xl font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">
          Queue Pay
        </h1>
      </div>
      <div className="w-1/2 flex flex-col justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  required
                  type="password"
                  onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  type="text"
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactno">Contact No</Label>
                <Input
                  id="contactno"
                  required
                  type="text"
                  onChange={e => setContactno(e.target.value)} />
              </div>
              <Button className="w-full" type="submit" onClick={handleClick}>
                Register
              </Button>
              <div className="w-full flex justify-center">
                <Link href="/login">
                  <CardDescription className="text-xs justify-center">Login</CardDescription>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
