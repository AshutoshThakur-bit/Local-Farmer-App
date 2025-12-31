import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

export default function Products() {
  
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching products from /products");
        const res = await axios.get("/products");
        console.log("Products response:", res.data);
        setItems(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
        swal("Error", err.response?.data?.message || "Failed to fetch products", "error");
      } finally {
        setLoading(false);
      }
    };
    
    // Get user role
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    
    fetchProducts();
  }, []);

  // Add to Cart
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  // Place Order
  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        swal("Please login to place an order");
        return;
      }

      if (cart.length === 0) {
        swal("Cart is empty");
        return;
      }

      setLoading(true);

      console.log("Cart items:", cart);
      console.log("First item farmerId:", cart[0]?.farmerId);

      const orderData = {
        products: cart,
        totalAmount: totalPrice,
        farmerId: cart[0]?.farmerId || null
      };

      console.log("Order data being sent:", orderData);

      const res = await axios.post("/orders/place", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      swal(res.data.message);
      setCart([]);
      setShowCart(false);
    } catch (err) {
      console.error("Order error:", err);
      swal(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-[#658C58] text-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Farmer Market</h1>

        <div className="flex items-center gap-5">

          {userRole === "Farmer" && (
            <button className="hover:text-gray-300 font-semibold">
              <Link to="/add-product">➕ Add Product</Link>
            </button>
          )}

          <button className="hover:text-gray-300">
            <Link to="/orders">📋 My Orders</Link>
          </button>

          {/* CART BUTTON */}
          <button
            onClick={() => setShowCart(true)}
            className="relative hover:text-gray-200 text-lg"
          >
            🛒 Cart
            <span className="ml-1 px-2 py-0.5 bg-red-600 rounded-full text-white text-sm">
              {cart.length}
            </span>
          </button>

          <input
            className="px-3 py-1 rounded-md text-black border-2"
            placeholder="Search"
          />

          <button className="hover:text-gray-300"> <Link to={"/aboutus"}>About Us</Link></button>
       
          <button className="hover:text-gray-300"><Link to={"/login"}>Login</Link></button>
        </div>
      </nav>

      {/* =======================================================
                     CART PAGE (Modal Style)
      ========================================================= */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-red-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-lg text-center">Your cart is empty.</p>
            ) : (
              <>
                <table className="w-full text-left mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-2">{item.title}</td>
                        <td>{item.qty}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.qty * item.price}</td>

                        <td>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TOTAL PRICE */}
                <div className="text-right text-xl font-bold mt-4">
                  Grand Total: ₹{totalPrice}
                </div>

                <div className="text-right mt-4">
                  <button 
                    onClick={placeOrder}
                    disabled={loading}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? "Placing Order..." : "Proceed to Checkout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <header className="h-150 bg-[#BBC863] flex flex-col justify-center items-center text-center">
        <h2 className="text-4xl font-bold">Buy Fresh Products From Farmers</h2>
        <p className="text-lg mt-2 text-gray-600">
          100% Organic | Best Prices | Direct From Village
        </p>
      </header>

      {/* ================= PRODUCTS ================= */}
      <div className="px-10 py-14 bg-[#F8F5E5]">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 border-l-8 border-yellow-500 pl-4">
          All Products
        </h2>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-2xl text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No products available</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {items.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3"
            >
              <img
                src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                alt={p.title}
                className="h-44 w-full rounded-lg object-cover"
                onError={(e) => {e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}}
              />

              <h3 className="text-lg font-semibold mt-3">{p.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-600">₹{p.price}</span>

                <button
                  onClick={() => addToCart(p)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#658C58] text-white text-center py-4 mt-10">
        © 2025 Farmer Marketplace | All Rights Reserved
      </footer>

    </div>
  );
}
