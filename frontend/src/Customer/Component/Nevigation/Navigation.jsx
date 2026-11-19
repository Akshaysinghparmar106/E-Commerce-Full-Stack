import React from "react";

function Navigation() {
  return (
    <nav className="navbar">
      <h2>MyShop</h2>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/">Products</a>
        <a href="/">Cart 🛒</a>
        <a href="/">Login</a>
      </div>
    </nav>
  );
}

export default Navigation;