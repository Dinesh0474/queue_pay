"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { redirect } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {
  const [shopData, setShopData] = useState(null);
  const params = useParams();
  const id = params.id;
  const [newQuantities, setNewQuantities] = useState([]);
  const [newProductIds, setNewProductIds] = useState([]);
  const router=useRouter();

  const handleclick = () => {
    localStorage.removeItem("userlogin")
    router.push("/login");
  } 
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(process.env.NEXT_Backend_URL+`/api/shopsuser/getproducts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setShopData(data);

          const newQuantityArray = data.products.map(() => 0);
          setNewQuantities(newQuantityArray);

          const newIds = data.products.map(item => item.id);
          setNewProductIds(newIds);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [id]);

  const [userid, setUserId] = useState(1);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userlogin");
    if (!isLoggedIn) {
        router.push("/login"); 
    }
  }, []);

  useEffect(() => {


    const fetchId = async () => {
      try {
        // Fetch user ID from local storage
        const data = await localStorage.getItem("userlogin");
        const user = JSON.parse(data);
        const userId = user.id;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchId(); // Fetch user ID when the component mounts
  }, [id]); // Include id in the dependency array to re-fetch orders when id changes

  
  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...newQuantities];
    updatedQuantities[index] = parseInt(value); 
    setNewQuantities(updatedQuantities);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    shopData.products.forEach((product, index) => {
      total += product.price * newQuantities[index];
    });
    return total;
  };

  const addorder = async () => {
    var orderquantity = [];
    var orderitemid = [];
    for (var i = 0; i < newQuantities.length; i++) {
      if (newQuantities[i] !== 0) {
        orderitemid.push(newProductIds[i]);
        orderquantity.push(newQuantities[i]);
      }
    }
    console.log(orderitemid);
    console.log(orderquantity);
    const orderdata = await axios.post(process.env.NEXT_Backend_URL+"/api/orders/addorder", {
      userId: userid,
      shopId: parseInt(shopData.shop_id),
      products: orderitemid,
      quantities: orderquantity,
      orderStatus: "inprocess"
    });
    
    console.log(orderdata)
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
    // Cleanup script tag if component unmounts
    document.body.removeChild(script);
    };
}, []);


const handleSubmit = (e) => {
  e.preventDefault();
  if (0 === calculateTotalAmount) {
    alert('Please enter amount');
  } else {
    var options = {
        key: "rzp_test_9ISK4OkoKJQrJe",
        key_secret:"PRZtSH1Mbb0AicPETOWD5uqv",
      amount: (calculateTotalAmount()*100).toString(),//check
      currency: 'INR',
      name: 'QueuePay',
      description: '',
      prefill: {
        name: 'Velmurugan',
        email: 'mvel1620r@gmail.com',
        contact: '7904425033',
      },
      notes: {
        address: 'Razorpay Corporate office',
      },
      theme: {
        color: '#3399cc',
      },
      payment_method: {
        method: 'upi',
        flow: 'intent',
      },
      handler: function (response) {
        if (response.error) {
          toast.success('Payment failed: ' + response.error.description);
        } else {
           addorder();
           toast.success('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        }
      },
    };
    if (window.Razorpay) {
      var pay = new window.Razorpay(options);
      pay.open();
    } else {
      toast.error('Something Went wrong');
      // alert('Razorpay SDK is still loading. Please try again.');
    }
  }
};

  return (
    <div>
      <Toaster
      position="top-center"
      reverseOrder={false}
        />
      <div className='fixed h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-5'>
        <div className='h-1/8 w-full flex justify-between '>
          <h1 className="font-medium bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent">Queue Pay</h1>
          <div>
            <Button className="w-full bg-slate-900" type="submit" onClick={handleclick} style={{ backgroundColor: '#595959' }}  >
              Logout
            </Button>
          </div>
        </div>
        <div>
          <div className='flex flex-col justify-start mt-4'>
            {shopData ? (
              <>
                <div>
                  <h1 className="font-medium  text-7xl bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display text-4xl font-bold tracking-[-0.02em] text-transparent">{shopData.name}</h1>
                </div>
                <br />
                <div className='flex flex-col gap-2'>
                  {shopData.products.map((product, index) => (
                    <div className="shadow-product flex justify-between items-center" key={product.id}>
                      <div className='flex flex-col'>
                        <h2 className='capitalize'>{product.name}</h2>
                        <h3>Price: ₹{product.price}</h3>
                      </div>
                      <div className="quantity-input">
                        <input
                          type="number"
                          min="0"
                          className='border-black-900 border-2'
                          max={product.quantity}
                          value={newQuantities[index]} // Set value to newQuantities[index]
                          onChange={(e) => handleQuantityChange(index, e.target.value)} // Call handleQuantityChange on change
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <h3 className="mr-4">Total Amount: ₹{calculateTotalAmount()}</h3>
                  <Button onClick={handleSubmit}>Place Order</Button>
                </div>
              </>
            ) : (
              <p>Loading...</p>
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
      `}</style>
    </div>
  );
}
