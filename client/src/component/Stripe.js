import React ,{useState,useEffect}from 'react'

const Stripe = () => {
    const [amount, setAmount] = useState('');

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
        if (amount === '') {
          alert('Please enter amount');
        } else {
          var options = {
            key: 'rzp_test_8XX7Yk6kzcQsGM',
            amount: amount * 100,
            currency: 'INR',
            name: 'STARTUP_PROJECTS',
            description: 'For testing purpose',
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
                alert('Payment failed: ' + response.error.description);
              } else {
                alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
              }
            },
          };
          if (window.Razorpay) {
            var pay = new window.Razorpay(options);
            pay.open();
          } else {
            alert('Razorpay SDK is still loading. Please try again.');
          }
        }
      };
    
      return (
        <div className="App">
          <h2>Razorpay Payment Integration Using React</h2>
          <br />
          <input
            type="text"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br />
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    }
export default Stripe