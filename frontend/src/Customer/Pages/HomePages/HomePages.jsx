import React from "react";
import Maincarousel from "../../Component/Homecarousel/Maincarousel";

function HomePages() {
  const products = [
    {
      name: "Smartphone",
      price: "₹19,999",
      description: "Latest smartphone with powerful performance",
    },
    {
      name: "Laptop",
      price: "₹49,999",
      description: "Fast and reliable laptop for work and study",
    },
    {
      name: "Headphones",
      price: "₹2,999",
      description: "Wireless headphones with clear sound",
    },
  ];

  return (
    <div className="home-page">

      <Maincarousel />

      <section className="welcome">
        <h1>Welcome to My E-Commerce Website</h1>
        <p>Shop the latest products at the best prices.</p>
      </section>

      <section className="products-section">
        <h2>Our Products</h2>

        <div className="product-container">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="product-image">
                🛍️
              </div>

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <h4>{product.price}</h4>

              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePages;