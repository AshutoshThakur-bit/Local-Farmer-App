import axios from "axios";
import { useEffect, useState } from "react";
import swal from "sweetalert";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        swal("Please login to view orders");
        return;
      }

      const res = await axios.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Orders received:", res.data);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      swal(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canCancelOrder = (status) => {
    const cancellableStatuses = ["pending", "confirmed"];
    return cancellableStatuses.includes(status?.toLowerCase());
  };

  const cancelOrder = async (orderId) => {
    swal({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.post(
            `/orders/cancel/${orderId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          swal(res.data.message);
          fetchOrders(); // Refresh orders
        } catch (err) {
          console.error("Cancel error:", err);
          swal(err.response?.data?.message || "Failed to cancel order");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-2xl">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600">No orders yet</p>
            <p className="text-gray-500">Start shopping to place your first order!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-lg font-semibold">{order._id?.slice(-8) || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                      {order.status?.toUpperCase() || "PENDING"}
                    </span>
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Products List */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                  <div className="space-y-2">
                    {order.products?.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-600">Qty: {product.qty}</p>
                        </div>
                        <p className="font-semibold">₹{product.price * product.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-end mb-4 border-t pt-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Status Timeline</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                      <span>Order Placed</span>
                      <span className="ml-auto text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    {order.status && order.status !== "pending" && (
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          ["confirmed", "shipped", "delivered"].includes(order.status?.toLowerCase()) 
                            ? "bg-green-500" 
                            : "bg-gray-300"
                        }`}></div>
                        <span>Order Confirmed</span>
                      </div>
                    )}
                    {["shipped", "delivered"].includes(order.status?.toLowerCase()) && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                        <span>Order Shipped</span>
                      </div>
                    )}
                    {order.status?.toLowerCase() === "delivered" && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                        <span>Delivered</span>
                        <span className="ml-auto text-gray-600">{new Date(order.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
