"use client";
import React, { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function Component() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactno, setContactno] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [secretkey, setSecretKey] = useState("");
  const [keyid, setKeyid] = useState("");
  const [done, setDone] = useState(1);

  const router = useRouter();

  const handleClick = async () => {
    try {
      const newkey = keyid + "--" + secretkey;
      const body = { email, password, name, contactno, key: newkey, location };
      const response = await axios.post("https://server-qkme.onrender.com"+"/api/shopsadmin/register", body, {
        headers: { "Content-Type": "application/json" }
      });
      const parseRes = await response.data; 
      console.log(parseRes); 
      if(response.status === 200){
        setDone(1);
        localStorage.setItem("adminlogin", JSON.stringify(parseRes));
      }
    } catch (err) {
      setDone(0);
      console.error(err.message);
    }
    if(done === 1) {
      router.push("/adminorders");
    } 
  };

  return (
    <div className="fixed h-full w-full flex bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5 overflow-auto">
      <div className="w-1/2 flex flex-col justify-center">
        <h1 className="text-7xl font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">
          Queue Pay
        </h1>
      </div>
      <div className="w-1/2 flex flex-col ">
        <div className=""> {/* Adding padding top here */}
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Admin Register</CardTitle>
              <CardDescription>Enter your details to create an admin account</CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    required
                    type="text"
                    onChange={e => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyid">Key ID</Label>
                  <Input
                    id="keyid"
                    required
                    type="text"
                    onChange={e => setKeyid(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretkey">Secret Key</Label>
                  <Input
                    id="secretkey"
                    required
                    type="text"
                    onChange={e => setSecretKey(e.target.value)} />
                </div>
                <Button className="w-full" type="submit" onClick={handleClick}>
                  Register
                </Button>
                <div className="w-full flex justify-center">
                  <Link href="/adminlogin">
                    <CardDescription className="text-xs justify-center">Admin Login</CardDescription>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
