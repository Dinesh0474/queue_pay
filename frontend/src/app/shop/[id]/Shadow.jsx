"use client"
import React from 'react';

const ShadowProduct = ({ product }) => {
  return (
    <div className="shadow-product">
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
      <p>Quantity: {product.quantity}</p>
      {/* Add more product details as needed */}
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
      `}</style>
    </div>
  );
};

export default ShadowProduct;
