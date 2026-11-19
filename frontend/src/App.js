import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [cart, setCart] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get products
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Get orders
  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Remove product from cart
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];

    updatedCart[index].quantity =
      (updatedCart[index].quantity || 1) + 1;

    setCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];

    const currentQuantity =
      updatedCart[index].quantity || 1;

    if (currentQuantity > 1) {
      updatedCart[index].quantity = currentQuantity - 1;
      setCart(updatedCart);
    }
  };


  // Total price
  const totalPrice = cart.reduce(
    (total, product) =>
      total + product.price * (product.quantity || 1),
    0
  );

  const handleAuth = async () => {

    if (!authEmail || !authPassword || (isRegister && !authName)) {
      alert("Please fill all required fields.");
      return;
    }

    if (isRegister && authPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const url = isRegister
      ? "http://localhost:8080/api/auth/register"
      : "http://localhost:8080/api/auth/login";

    const requestData = isRegister
      ? {
        name: authName,
        email: authEmail,
        password: authPassword
      }
      : {
        email: authEmail,
        password: authPassword
      };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(data.message);

      setAuthPassword("");
      setConfirmPassword("");

      if (isRegister) {
        setIsRegister(false);
      } else {
        setShowLogin(false);
      }

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>MyShop 🛒</h2>

        <div className="nav-links">

          <button
            onClick={() => {
              setShowCart(false);
              setShowCheckout(false);
              setShowOrders(false);
              setShowLogin(false);
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              setShowCart(false);
              setShowCheckout(false);
              setShowOrders(false);
              setShowLogin(false);
            }}
          >
            Products
          </button>

          <button
            className="cart-button"
            onClick={() => {
              setShowCart(true);
              setShowCheckout(false);
              setShowOrders(false);
              setShowLogin(false);
            }}
          >
            Cart 🛒 ({cart.length})
          </button>

          <button
            onClick={() => {
              setShowOrders(true);
              setShowCart(false);
              setShowCheckout(false);
              setShowLogin(false);
            }}
          >
            My Orders
          </button>

          <button
            className="login-nav-button"
            onClick={() => {
              setShowLogin(true);
              setShowCart(false);
              setShowCheckout(false);
              setShowOrders(false);
            }}
          >
            Login
          </button>

        </div>
      </nav>

      {/* LOGIN / REGISTER */}
      {showLogin ? (

        <section className="auth-section">
          <div className="auth-card">

            <h1>
              {isRegister ? "Create Account" : "Login"}
            </h1>

            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />

            {isRegister && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <button
              className="auth-button"
              onClick={handleAuth}
            >
              {isRegister ? "Register" : "Login"}
            </button>
            <p>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              className="switch-button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? "Login here"
                : "Create new account"}
            </button>

          </div>
        </section>

      ) : showOrders ? (

        /* MY ORDERS */
        <section className="orders-section">

          <h1>My Orders 📦</h1>

          {orders.length === 0 ? (

            <h2>No orders found</h2>

          ) : (

            <div className="orders-container">

              {orders.map((order) => (

                <div
                  className="order-card"
                  key={order.id}
                >

                  <h3>
                    Order #{order.id}
                  </h3>

                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customerName}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.customerEmail}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {order.status}
                  </p>

                  <h3>
                    Total: ₹
                    {order.totalPrice.toLocaleString()}
                  </h3>

                </div>

              ))}

            </div>

          )}

        </section>

      ) : showCheckout ? (

        /* CHECKOUT */
        <section className="checkout-section">

          <h1>Checkout 🛒</h1>

          <div className="checkout-container">

            <h2>Order Summary</h2>

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(e.target.value)
              }
            />

            {cart.map((product, index) => (
              <div
                className="checkout-item"
                key={index}
              >
                <span>
                  {product.name} × {product.quantity || 1}
                </span>

                <span>
                  ₹{(
                    product.price * (product.quantity || 1)
                  ).toLocaleString()}
                </span>
              </div>
            ))}

            <hr />

            <h2>
              Total: ₹{totalPrice.toLocaleString()}
            </h2>

            <button
              onClick={() => {

                if (!customerName || !customerEmail) {
                  alert("Please enter your name and email.");
                  return;
                }

                const order = {
                  customerName: customerName,
                  customerEmail: customerEmail,
                  totalPrice: totalPrice,
                };

                console.log("ORDER DATA:", order);

                fetch("http://localhost:8080/api/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(order),
                })
                  .then((response) => {

                    if (!response.ok) {
                      throw new Error("Order failed");
                    }

                    return response.json();
                  })

                  .then((data) => {

                    console.log("Order saved:", data);

                    alert(
                      "Order placed successfully! 🎉"
                    );

                    setCart([]);
                    setCustomerName("");
                    setCustomerEmail("");

                    setShowCheckout(false);
                    setShowCart(false);

                    // Refresh orders
                    fetch("http://localhost:8080/api/orders")
                      .then((response) => response.json())
                      .then((data) => setOrders(data));

                  })

                  .catch((error) => {

                    console.error(
                      "Order error:",
                      error
                    );

                    alert(
                      "Order failed. Please try again."
                    );

                  });

              }}
            >
              Place Order
            </button>

            <button
              onClick={() => {
                setShowCheckout(false);
                setShowCart(true);
              }}
            >
              Back to Cart
            </button>

          </div>

        </section>

      ) : showCart ? (

        /* CART */
        <section className="cart-section">

          <h1>My Cart 🛒</h1>

          {cart.length === 0 ? (

            <div>
              <h2>Your cart is empty</h2>
            </div>

          ) : (

            <div className="cart-container">

              {cart.map((product, index) => (

                <div
                  className="cart-item"
                  key={index}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>
                    <h3>{product.name}</h3>

                    <p>
                      ₹{product.price.toLocaleString()}
                    </p>

                    <div className="quantity-control">

                      <button
                        onClick={() => decreaseQuantity(index)}
                      >
                        −
                      </button>

                      <span>
                        {product.quantity || 1}
                      </span>

                      <button
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>

                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="cart-total">

                <h2>
                  Total: ₹
                  {totalPrice.toLocaleString()}
                </h2>

                <button
                  onClick={() =>
                    setShowCheckout(true)
                  }
                >
                  Checkout
                </button>

              </div>

            </div>

          )}

        </section>

      ) : (

        /* HOME + PRODUCTS */
        <>
          <section className="home">

            <h1>
              Welcome to My E-Commerce Website
            </h1>

            <p>
              Shop the latest products at the best prices.
            </p>

            <button>
              Shop Now
            </button>

          </section>

          <section className="products">

            <h2>Our Products</h2>

            <div className="product-container">

              {products.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-img">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  </div>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <h4>
                    ₹{product.price.toLocaleString()}
                  </h4>

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    Add to Cart
                  </button>

                </div>

              ))}

            </div>

          </section>
        </>
      )}

    </div>
  );
}

export default App;