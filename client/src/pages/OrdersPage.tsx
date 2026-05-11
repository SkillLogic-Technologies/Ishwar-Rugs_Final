import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, MapPin, Truck } from "lucide-react";

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const BASE_URL = "/";

 useEffect(() => {
  fetchOrders();

  const interval = setInterval(() => {
    fetchOrders();
  }, 5000); // every 5 seconds

  return () => clearInterval(interval);
}, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/order/my-orders`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/40";
      case "Shipped":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/40";
      case "Delivered":
        return "bg-green-100 text-green-600 dark:bg-green-900/40";
      case "Cancelled":
        return "bg-red-100 text-red-600 dark:bg-red-900/40";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6">
      <h1 className="text-3xl font-bold mb-12 text-center tracking-wide">
        My Orders
      </h1>

      {orders.length === 0 && (
        <p className="text-center text-muted-foreground">No orders found</p>
      )}

      {orders.map((order) => {
        const isCancelled = order.orderStatus === "Cancelled";

        return (
          <div
            key={order._id}
            className={`rounded-2xl shadow-lg p-8 mb-12 border transition 
            ${isCancelled ? "border-red-400/40 bg-red-50/40 dark:bg-red-900/10" : "bg-card"}
            `}
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <div>
                <p
                  className={`font-semibold text-lg ${
                    isCancelled ? "text-red-600 line-through" : ""
                  }`}
                >
                  Order ID: {order._id}
                </p>

                <span
                  className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="text-left md:text-right">
                <p
                  className={`text-xl font-bold ${
                    isCancelled ? "text-red-600 line-through" : ""
                  }`}
                >
                  ₹{order.totalAmount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-5">
              {order.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border rounded-xl p-5 hover:shadow-md transition"
                >
                  <Link href={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link href={`/product/${item.slug}`}>
                      <h2
                        className={`font-medium text-lg hover:underline cursor-pointer ${
                          isCancelled ? "text-red-600 line-through" : ""
                        }`}
                      >
                        {item.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-muted-foreground mt-2">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div
                    className={`font-semibold text-lg ${
                      isCancelled ? "text-red-600 line-through" : ""
                    }`}
                  >
                    ₹{item.subtotal}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="mt-10">
              <div className="bg-muted/30 dark:bg-neutral-800 rounded-xl p-6 border">
                <h3 className="font-semibold text-lg mb-4 tracking-wide flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Shipping Address
                </h3>

                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>
                  <p>{order.shippingAddress.pincode}</p>
                 <p className="mt-2 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  {order.shippingAddress.phone}
                </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrdersPage;